import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { ChartContainer } from "./shared/ChartContainer";
import { ChartTooltip } from "./shared/ChartTooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CHART_MARGIN = { top: 10, right: 30, left: 60, bottom: 20 };

export function PriceTrendChart() {
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

  if (isLoading) {
    return <ChartContainer title="Price Trend" />;
  }

  const YearSelector = (
    <Select
      value={selectedYear}
      onValueChange={setSelectedYear}
    >
      <SelectTrigger className="w-[180px]">
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
  );

  return (
    <ChartContainer 
      title="Price Trend" 
      headerContent={YearSelector}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
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
          />
          <ChartTooltip 
            valueFormatter={(value) => `$${value.toFixed(2)}/MMBtu`}
          />
          <Legend />
          <Bar
            dataKey="longTerm"
            name="Long Term"
            fill="#0EA5E9"
            stackId="stack"
            fillOpacity={1}
            style={{ opacity: "var(--opacity)" }}
          />
          <Bar
            dataKey="spot"
            name="Spot"
            fill="#F59E0B"
            stackId="stack"
            fillOpacity={1}
            style={{ opacity: "var(--opacity)" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}