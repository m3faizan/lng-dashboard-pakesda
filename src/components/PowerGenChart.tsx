import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PowerGenData = Database['public']['Tables']['LNG Power Gen']['Row'];

interface PowerGenChartProps {
  dataKey: keyof PowerGenData;
  color: string;
  valueFormatter: (value: number) => string;
  label: string;
  margin?: { top: number; right: number; left: number; bottom: number };
  yAxisWidth?: number;
  xAxisHeight?: number;
  tickMargin?: number;
}

export function PowerGenChart({ 
  dataKey, 
  color, 
  valueFormatter, 
  label,
  margin = { top: 20, right: 30, left: 40, bottom: 30 },
  yAxisWidth = 50,
  xAxisHeight = 60,
  tickMargin = 20
}: PowerGenChartProps) {
  const [data, setData] = useState<Array<{date: string; volume: number}>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date('2019-01-01');
        const endDate = new Date();

        const { data: powerGenData, error: supabaseError } = await supabase
          .from('LNG Power Gen')
          .select('date, ' + dataKey)
          .gte('date', startDate.toISOString())
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
          .filter((item): item is NonNullable<typeof powerGenData[0]> => 
            item !== null && 
            typeof item.date === 'string' && 
            typeof item[dataKey] === 'number'
          )
          .map(item => ({
            date: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
            volume: Number(item[dataKey])
          }));

        setData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('An unexpected error occurred');
      }
    };

    fetchData();
  }, [dataKey]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    
    return (
      <div className="bg-[#1A1E2D] border border-gray-700 rounded-lg p-3 text-sm shadow-lg">
        <div className="text-gray-400 mb-2">{payload[0].payload.date}</div>
        <div className="text-white">
          <span>{label}: </span>
          <span className="font-mono">{valueFormatter(payload[0].value)}</span>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={margin}
      >
        <XAxis
          dataKey="date"
          stroke="#525252"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          height={xAxisHeight}
          tickMargin={tickMargin}
          angle={-45}
          textAnchor="end"
        />
        <YAxis
          stroke="#525252"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toFixed(0)}
          width={yAxisWidth}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="volume"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}