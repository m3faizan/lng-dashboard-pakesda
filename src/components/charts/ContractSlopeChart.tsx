
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
import { useIsMobile } from "@/hooks/use-mobile";

export function ContractSlopeChart() {
  const isMobile = useIsMobile();
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

  const chartMargin = isMobile
    ? { top: 10, right: 10, left: 40, bottom: 60 }
    : { top: 10, right: 30, left: 60, bottom: 40 };

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
      <div className="h-full w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg rounded-lg p-2 md:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
            margin={chartMargin}
          >
            <XAxis
              dataKey="date"
              stroke="#525252"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={isMobile ? 1 : "preserveStartEnd"}
            />
            <YAxis
              stroke="#525252"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              width={isMobile ? 40 : 50}
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
