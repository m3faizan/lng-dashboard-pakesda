import { useQuery } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

type Series = "longTerm" | "spot" | "all";

export function PriceTrendChart() {
  const [visibleSeries, setVisibleSeries] = useState<Series[]>(["all"]);

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["price-trend"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("LNG Port_Price_Import")
        .select("date, Long_Term_DES, Spot_DES")
        .order("date");

      if (error) throw error;

      return data.map((item) => ({
        date: new Date(item.date as string).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        longTerm: item.Long_Term_DES,
        spot: item.Spot_DES,
      }));
    },
  });

  const handleLegendClick = (series: Series) => {
    if (series === "all") {
      setVisibleSeries(["all"]);
    } else {
      const newSeries = visibleSeries.filter((s) => s !== "all");
      if (newSeries.includes(series)) {
        if (newSeries.length === 1) {
          setVisibleSeries(["all"]);
        } else {
          setVisibleSeries(newSeries.filter((s) => s !== series));
        }
      } else {
        setVisibleSeries([...newSeries, series]);
      }
    }
  };

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
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold">Price Trend</CardTitle>
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}/MMBtu`,
                name === "longTerm" ? "Long Term Price" : "Spot Price"
              ]}
            />
            <Legend
              onClick={(e) => {
                const series = e.dataKey as Series;
                handleLegendClick(series);
              }}
            />
            {(visibleSeries.includes("all") || visibleSeries.includes("longTerm")) && (
              <Line
                type="linear"
                dataKey="longTerm"
                name="Long Term"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
              />
            )}
            {(visibleSeries.includes("all") || visibleSeries.includes("spot")) && (
              <Line
                type="linear"
                dataKey="spot"
                name="Spot"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}