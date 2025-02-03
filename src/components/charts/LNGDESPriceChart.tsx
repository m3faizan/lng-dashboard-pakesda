import { useQuery } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartContainer } from "./shared/ChartContainer";
import { ChartTooltip } from "./shared/ChartTooltip";
import { supabase } from "@/integrations/supabase/client";

const CHART_MARGIN = { top: 10, right: 30, left: 60, bottom: 20 };

export function LNGDESPriceChart() {
  const { data: chartData = [], isLoading, error } = useQuery({
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
        price: Number(item.wAvg_DES),
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

  if (error) {
    return (
      <ChartContainer title="LNG DES Price">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-red-500">Error loading data</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="LNG DES Price">
      <div className="h-[320px] transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg rounded-lg p-4">
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
            <Tooltip
              content={({ active, payload }) => (
                <ChartTooltip 
                  active={active}
                  payload={payload}
                  valueFormatter={(value) => `$${value.toFixed(2)}/MMBtu`}
                  labelFormatter={() => "Price"}
                />
              )}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4ADE80"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}