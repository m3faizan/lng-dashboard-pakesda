import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export function SystemGenerationChart() {
  const [period, setPeriod] = useState("monthly");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date('2019-01-01');
        const endDate = new Date();

        const { data: powerGenData, error: supabaseError } = await supabase
          .from('LNG Power Gen')
          .select('date, powerGeneration, total_power_gen')
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

        const transformedData = powerGenData.map(item => {
          const date = new Date(item.date);
          let label;

          switch (period) {
            case "monthly":
              label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
              break;
            case "quarterly":
              const quarter = Math.floor(date.getMonth() / 3) + 1;
              label = `Q${quarter} '${date.getFullYear().toString().slice(-2)}`;
              break;
            case "yearly":
              label = date.getFullYear().toString();
              break;
            default:
              label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
          }

          return {
            period: label,
            rlng: Number(item.powerGeneration || 0),
            other: Number(item.total_power_gen || 0) - Number(item.powerGeneration || 0)
          };
        });

        const groupedData = transformedData.reduce((acc: any[], curr) => {
          const existingPeriod = acc.find(item => item.period === curr.period);
          if (existingPeriod) {
            existingPeriod.rlng += curr.rlng;
            existingPeriod.other += curr.other;
          } else {
            acc.push(curr);
          }
          return acc;
        }, []);

        setData(groupedData);
        setError(null);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('An unexpected error occurred');
      }
    };

    fetchData();
  }, [period]);

  const handleLegendClick = (dataKey: string | number | ((obj: any) => any)) => {
    // Convert the dataKey to string, handling function case
    const key = typeof dataKey === 'function' ? 'unknown' : String(dataKey);
    setHiddenSeries(prev => 
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-5">
        <h2 className="text-lg font-semibold">Total System Generation</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload) return null;
    
    return (
      <div className="bg-[#1A1E2D] border border-gray-700 rounded-lg p-3 text-sm shadow-lg">
        <div className="text-gray-400 mb-2">{payload[0]?.payload.period}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="text-white">
            <span>{entry.dataKey === 'rlng' ? 'RLNG: ' : 'Other Sources: '}</span>
            <span className="font-mono">{entry.value.toFixed(2)} GWh</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-lg font-semibold mb-4">Total System Generation</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <XAxis 
              dataKey="period" 
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              onClick={(e) => handleLegendClick(e.dataKey)}
              formatter={(value) => {
                const labels = {
                  rlng: "RLNG",
                  other: "Other Sources"
                };
                return labels[value as keyof typeof labels];
              }}
            />
            <Bar 
              dataKey="rlng" 
              stackId="a" 
              fill="#4ADE80" 
              fillOpacity={hiddenSeries.includes('rlng') ? 0.3 : 1}
            />
            <Bar 
              dataKey="other" 
              stackId="a" 
              fill="#0EA5E9" 
              fillOpacity={hiddenSeries.includes('other') ? 0.3 : 1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
