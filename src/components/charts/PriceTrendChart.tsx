import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

type Series = "longTerm" | "spot" | "all";

export function PriceTrendChart() {
  const [visibleSeries, setVisibleSeries] = useState<Series[]>(["all"]);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const { data: rawData = [], isLoading } = useQuery({
    queryKey: ["price-trend"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("LNG Port_Price_Import")
        .select("date, Long_Term_DES, Spot_DES")
        .order("date");

      if (error) throw error;

      return data.map((item) => ({
        date: new Date(item.date as string),
        formattedDate: new Date(item.date as string).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        year: new Date(item.date as string).getFullYear().toString(),
        longTerm: item.Long_Term_DES,
        spot: item.Spot_DES,
      }));
    },
  });

  const years = useMemo(() => {
    if (!rawData.length) return ["all"];
    const uniqueYears = [...new Set(rawData.map(item => item.year))];
    return ["all", ...uniqueYears.sort((a, b) => b.localeCompare(a))];
  }, [rawData]);

  const chartData = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      date: item.formattedDate,
      longTerm: item.longTerm,
      spot: item.spot,
      opacity: selectedYear === "all" || item.year === selectedYear ? 1 : 0.3
    }));
  }, [rawData, selectedYear]);

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
        <Select
          value={selectedYear}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger className="w-[180px] mt-4">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year === "all" ? "All Years" : year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
              <Bar
                dataKey="longTerm"
                name="Long Term"
                fill="#0EA5E9"
                stackId="stack"
                fillOpacity={1}
                style={{ opacity: "var(--opacity)" }}
              />
            )}
            {(visibleSeries.includes("all") || visibleSeries.includes("spot")) && (
              <Bar
                dataKey="spot"
                name="Spot"
                fill="#F59E0B"
                stackId="stack"
                fillOpacity={1}
                style={{ opacity: "var(--opacity)" }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}