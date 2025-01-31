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

        // Group data based on period
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

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-5">
        <h2 className="text-lg font-semibold">Total System Generation</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-5">
        <h2 className="text-lg font-semibold">Total System Generation</h2>
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1E2D",
              border: "none",
              borderRadius: "8px",
              fontFamily: "Arial",
              fontSize: "12px",
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => {
              const labels = {
                rlng: "RLNG",
                other: "Other Sources"
              };
              return labels[value as keyof typeof labels];
            }}
          />
          <Bar dataKey="rlng" stackId="a" fill="#4ADE80" />
          <Bar dataKey="other" stackId="a" fill="#0EA5E9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}