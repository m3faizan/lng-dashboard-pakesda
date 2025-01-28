import { useQuery } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ContractSlopeChart() {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["contract-slope"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("LNG Port_Price_Import")
        .select("date, DES_Slope")
        .order("date");

      if (error) throw error;

      return data.map((item) => ({
        date: new Date(item.date as string).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        slope: item.DES_Slope,
      }));
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-dashboard-navy border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-semibold">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-dashboard-navy border-0">
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-lg font-semibold mb-4">Contract Slope</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="date"
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
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, "Slope"]}
            />
            <Line
              type="linear"
              dataKey="slope"
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}