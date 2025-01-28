import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const formatYAxis = (value: number) => {
  return `${(value / 1000000).toFixed(1)}M`;
};

const formatTooltipValue = (value: number) => {
  return `${value.toLocaleString()} MMBtu`;
};

export function ContractVolumesChart() {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["lng-information"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("LNG Information")
        .select("date, LT_Volume, Spot_Volume")
        .order("date");

      if (error) throw error;

      return data.map((item) => ({
        date: new Date(item.date as string).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        "Long Term": item.LT_Volume,
        Spot: item.Spot_Volume,
      }));
    },
  });

  const handleLegendClick = (e: any) => {
    const seriesName = e.dataKey;
    if (hiddenSeries.length === 1 && hiddenSeries.includes(seriesName)) {
      return; // Prevent hiding last visible series
    }
    setHiddenSeries(
      hiddenSeries.includes(seriesName)
        ? hiddenSeries.filter((name) => name !== seriesName)
        : [...hiddenSeries, seriesName]
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-dashboard-navy border-0 h-[400px]">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-semibold">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-dashboard-navy border-0 h-[400px]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold">
          Contract Volumes (MMBtu)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                formatTooltipValue(value),
                name,
              ]}
            />
            <Legend onClick={handleLegendClick} />
            <Line
              type="linear"
              dataKey="Long Term"
              stroke="#4ADE80"
              strokeWidth={2}
              dot={false}
              hide={hiddenSeries.includes("Long Term")}
              opacity={hiddenSeries.length > 0 ? 0.5 : 1}
            />
            <Line
              type="linear"
              dataKey="Spot"
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={false}
              hide={hiddenSeries.includes("Spot")}
              opacity={hiddenSeries.length > 0 ? 0.5 : 1}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}