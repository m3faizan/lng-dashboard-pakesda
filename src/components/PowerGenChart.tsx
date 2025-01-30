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
import { PeriodSelector } from "@/components/chart/PeriodSelector";

const timeframes = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "YTD", months: new Date().getMonth() },
  { label: "1Y", months: 12 },
  { label: "5Y", months: 60 },
  { label: "Max", months: 120 },
] as const;

interface PowerGenChartProps {
  dataKey: "powerGeneration" | "powerGenCost" | "rlngShare";
  color: string;
  valueFormatter: (value: number) => string;
}

export function PowerGenChart({ dataKey, color, valueFormatter }: PowerGenChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const endDate = new Date();
      const startDate = new Date();
      
      startDate.setMonth(endDate.getMonth() - selectedTimeframe);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      endDate.setHours(23, 59, 59, 999);
      
      const minDate = new Date('2019-01-01');
      const actualStartDate = startDate < minDate ? minDate : startDate;

      const { data: powerGenData, error } = await supabase
        .from('LNG Power Gen')
        .select(`date, ${dataKey}`)
        .gte('date', actualStartDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const transformedData = powerGenData
        .filter(item => item.date && item[dataKey] !== null)
        .map(item => ({
          month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
          date: new Date(item.date),
          value: Number(item[dataKey])
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setData(transformedData);
    };

    fetchData();
  }, [selectedTimeframe, dataKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setSelectedTimeframe(tf.months)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === tf.months
                  ? `bg-[${color}] text-black`
                  : "bg-dashboard-dark text-muted-foreground hover:bg-dashboard-dark/80"
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
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
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
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [valueFormatter(value), ""]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fillOpacity={1}
              fill={`url(#color${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}