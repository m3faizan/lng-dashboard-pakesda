import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function PortChargesChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: response, error } = await supabase
        .from('LNG Port_Price_Import')
        .select('date, wAvg_Port_Charges')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching port charges data:', error);
        return;
      }

      const formattedData = response.map(item => ({
        month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
        charges: Number(item.wAvg_Port_Charges)
      }));

      setData(formattedData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-dashboard-navy border-0 h-[480px] w-full">
        <div className="flex flex-col items-center pt-6">
          <CardTitle className="text-lg font-semibold">Loading...</CardTitle>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg overflow-hidden">
      <div className="flex flex-col items-center pt-6 pb-2">
        <CardTitle className="text-lg font-semibold mb-4">Port Charges ($/MMBtu)</CardTitle>
      </div>
      <CardContent className="h-[400px] px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <XAxis
              dataKey="month"
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
              }}
              formatter={(value: number) => [`${value.toFixed(2)} $/MMBtu`, 'Port Charges']}
            />
            <Line
              type="monotone"
              dataKey="charges"
              stroke="#4fd1c5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
