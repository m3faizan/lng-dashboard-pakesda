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
import { TimeFrameSelector } from "@/components/charts/TimeFrameSelector";

interface PowerGenChartProps {
  dataKey: "powerGeneration" | "powerGenCost" | "rlngShare";
  color: string;
  valueFormatter: (value: number) => string;
  label: string;
}

interface PowerGenData {
  date: string;
  powerGeneration: number | null;
  powerGenCost: number | null;
  rlngShare: number | null;
}

export function PowerGenChart({ dataKey, color, valueFormatter, label }: PowerGenChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        
        startDate.setMonth(endDate.getMonth() - selectedTimeframe);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        
        endDate.setHours(23, 59, 59, 999);
        
        const minDate = new Date('2019-01-01');
        const actualStartDate = startDate < minDate ? minDate : startDate;

        const { data: powerGenData, error: supabaseError } = await supabase
          .from('LNG Power Gen')
          .select(`date, ${dataKey}`)
          .gte('date', actualStartDate.toISOString())
          .lte('date', endDate.toISOString())
          .order('date', { ascending: true });

        if (supabaseError) {
          console.error('Error fetching data:', supabaseError);
          setError('Failed to load data');
          return;
        }

        if (!powerGenData) {
          setError('No data available');
          return;
        }

        const transformedData = powerGenData
          .filter((item): item is PowerGenData => {
            return item !== null && typeof item.date === 'string';
          })
          .map(item => ({
            month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
            date: new Date(item.date),
            value: Number(item[dataKey]) || 0
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        setData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('An unexpected error occurred');
      }
    };

    fetchData();
  }, [selectedTimeframe, dataKey]);

  if (error) {
    return (
      <div className="space-y-6">
        <TimeFrameSelector 
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          color={color}
        />
        <div className="h-[320px] flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TimeFrameSelector 
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
        color={color}
      />
      
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
              formatter={(value: number) => [valueFormatter(value), label]}
              labelFormatter={(label) => label}
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