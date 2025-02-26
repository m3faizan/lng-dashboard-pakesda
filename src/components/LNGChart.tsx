
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const timeframes = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "YTD", months: new Date().getMonth() },
  { label: "1Y", months: 12 },
  { label: "5Y", months: 60 },
  { label: "Max", months: 120 },
] as const;

export function LNGChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const [data, setData] = useState<any[]>([]);
  const [showPercentage, setShowPercentage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let queryBuilder = supabase
        .from('LNG Information')
        .select('date, import_Volume')
        .order('date', { ascending: false });

      // Get most recent date first
      const { data: latestData } = await queryBuilder.limit(1);
      
      if (!latestData || latestData.length === 0) return;
      
      const latestDate = new Date(latestData[0].date);
      const startDate = new Date(latestDate);

      // For YTD, use current year's start
      if (selectedTimeframe === new Date().getMonth()) {
        startDate.setFullYear(new Date().getFullYear(), 0, 1); // January 1st of current year
      } else {
        // For other timeframes, go back X-1 months from latest date
        // We subtract 1 from the selectedTimeframe because we want the current month plus X-1 previous months
        startDate.setMonth(latestDate.getMonth() - (selectedTimeframe - 1));
        startDate.setDate(1);
      }
      
      startDate.setHours(0, 0, 0, 0);
      
      const { data: lngData, error } = await supabase
        .from('LNG Information')
        .select('date, import_Volume')
        .gte('date', startDate.toISOString())
        .lte('date', latestDate.toISOString())
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const transformedData = lngData
        .filter(item => item.date && item.import_Volume !== null)
        .map((item, index, array) => {
          const currentValue = Number(item.import_Volume);
          let percentageChange = 0;
          
          if (index > 0) {
            const previousValue = Number(array[index - 1].import_Volume);
            percentageChange = previousValue !== 0 
              ? ((currentValue - previousValue) / previousValue) * 100 
              : 0;
          }

          return {
            month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
            date: new Date(item.date),
            volume: currentValue,
            percentageChange
          };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setData(transformedData);
    };

    fetchData();
  }, [selectedTimeframe]);

  const getDisplayValue = (dataPoint: any) => {
    return showPercentage ? dataPoint.percentageChange : dataPoint.volume;
  };

  const formatValue = (value: number) => {
    if (showPercentage) {
      return `${value.toFixed(2)}%`;
    }
    return `${(value / 1000000).toFixed(2)}M MMBtu`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setSelectedTimeframe(tf.months)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedTimeframe === tf.months
                  ? "bg-dashboard-green text-black"
                  : "bg-dashboard-dark/50 text-muted-foreground hover:bg-dashboard-dark"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPercentage(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              !showPercentage
                ? "bg-dashboard-green text-black"
                : "bg-dashboard-dark/50 text-muted-foreground hover:bg-dashboard-dark"
            }`}
          >
            MMBtu
          </button>
          <button
            onClick={() => setShowPercentage(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              showPercentage
                ? "bg-dashboard-green text-black"
                : "bg-dashboard-dark/50 text-muted-foreground hover:bg-dashboard-dark"
            }`}
          >
            %
          </button>
        </div>
      </div>
      
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => 
                showPercentage 
                  ? `${value.toFixed(1)}%`
                  : `${(value / 1000000).toFixed(1)}M`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [formatValue(value), showPercentage ? "Change" : "Volume"]}
            />
            <Area
              type="monotone"
              dataKey={showPercentage ? "percentageChange" : "volume"}
              stroke="#4ADE80"
              fillOpacity={1}
              fill="url(#colorVolume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
