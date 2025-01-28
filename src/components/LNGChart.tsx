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

  useEffect(() => {
    const fetchData = async () => {
      // Calculate the date range based on selected timeframe
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - selectedTimeframe);

      // Ensure we don't go before Jan 2019
      const minDate = new Date('2019-01-01');
      const actualStartDate = startDate < minDate ? minDate : startDate;

      const { data: lngData, error } = await supabase
        .from('LNG Information')
        .select('date, import_Volume')
        .gte('date', actualStartDate.toISOString())
        .lte('date', '2024-12-31')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      // Filter out null values and transform the data
      const transformedData = lngData
        .filter(item => item.date && item.import_Volume !== null)
        .map(item => ({
          month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
          date: new Date(item.date),
          volume: Number(item.import_Volume)
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setData(transformedData);
    };

    fetchData();
  }, [selectedTimeframe]);

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
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${(value / 1000).toFixed(1)}k`, "Volume"]}
            />
            <Area
              type="monotone"
              dataKey="volume"
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