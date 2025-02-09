
import { useQuery } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer } from "./shared/ChartContainer";
import { ChartTooltip } from "./shared/ChartTooltip";

const CHART_MARGIN = { top: 10, right: 20, left: 50, bottom: 20 };

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
      <ChartContainer title="Contract Slope">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="Contract Slope">
      <div className="h-[200px] md:h-[280px] transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg rounded-lg p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
            margin={CHART_MARGIN}
          >
            <XAxis
              dataKey="date"
              stroke="#525252"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              height={50}
              angle={-45}
              textAnchor="end"
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#525252"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              width={45}
            />
            <Tooltip
              content={({ active, payload }) => (
                <ChartTooltip 
                  active={active}
                  payload={payload}
                  valueFormatter={(value) => `${value.toFixed(2)}%`}
                  labelFormatter={() => "Slope"}
                />
              )}
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
      </div>
    </ChartContainer>
  );
}
