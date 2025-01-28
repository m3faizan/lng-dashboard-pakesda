import { useQuery } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer } from "./shared/ChartContainer";
import { ChartTooltip } from "./shared/ChartTooltip";

const CHART_MARGIN = { top: 10, right: 30, left: 60, bottom: 20 };

export function LNGDESPriceChart() {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["lng-des-price"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("LNG Port_Price_Import")
        .select("date, wAvg_DES")
        .order("date");

      if (error) throw error;

      return data.map((item) => ({
        date: new Date(item.date as string).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        price: item.wAvg_DES,
      }));
    },
  });

  if (isLoading) {
    return (
      <ChartContainer title="LNG DES Price">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="LNG DES Price">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={chartData}
          margin={CHART_MARGIN}
        >
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
            tickFormatter={(value) => `$${value}`}
            width={50}
          />
          <ChartTooltip 
            valueFormatter={(value) => `$${value.toFixed(2)}/MMBtu`}
            labelFormatter={() => "Price"}
          />
          <Line
            type="linear"
            dataKey="price"
            stroke="#4ADE80"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}