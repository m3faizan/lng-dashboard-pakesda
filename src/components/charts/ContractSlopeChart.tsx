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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const timeframes = [
  { label: "All", value: "all" },
  { label: "Last Year", value: "lastYear" },
  { label: "This Year", value: "thisYear" },
] as const;

export function ContractSlopeChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["contract-slope", selectedTimeframe],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      let query = supabase
        .from("LNG Port_Price_Import")
        .select("date, DES_Slope")
        .order("date");

      if (selectedTimeframe === "thisYear") {
        query = query.gte("date", `${currentYear}-01-01`);
      } else if (selectedTimeframe === "lastYear") {
        query = query
          .gte("date", `${currentYear - 1}-01-01`)
          .lt("date", `${currentYear}-01-01`);
      }

      const { data, error } = await query;

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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Contract Slope</CardTitle>
        <Select
          value={selectedTimeframe}
          onValueChange={setSelectedTimeframe}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeframes.map((tf) => (
              <SelectItem key={tf.value} value={tf.value}>
                {tf.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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