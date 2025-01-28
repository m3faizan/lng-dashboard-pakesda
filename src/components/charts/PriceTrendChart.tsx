import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
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
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

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
      longTerm: selectedYear === "all" || item.year === selectedYear 
        ? hiddenSeries.includes("longTerm") ? 0 : item.longTerm 
        : hiddenSeries.includes("longTerm") ? 0 : item.longTerm * 0.15,
      spot: selectedYear === "all" || item.year === selectedYear 
        ? hiddenSeries.includes("spot") ? 0 : item.spot 
        : hiddenSeries.includes("spot") ? 0 : item.spot * 0.15
    }));
  }, [rawData, selectedYear, hiddenSeries]);

  const handleLegendClick = (dataKey: string) => {
    setHiddenSeries(prev => 
      prev.includes(dataKey) 
        ? prev.filter(key => key !== dataKey)
        : [...prev, dataKey]
    );
  };

  if (isLoading) {
    return (
      <ChartContainer title="Price Trend">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </ChartContainer>
    );
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
          <Tooltip
            content={({ active, payload }) => (
              <ChartTooltip 
                active={active}
                payload={payload}
                valueFormatter={(value) => `$${value.toFixed(2)}/MMBtu`}
              />
            )}
          />
          <Legend 
            onClick={(e) => handleLegendClick(e.dataKey)}
            formatter={(value, entry) => {
              const isHidden = hiddenSeries.includes(entry.dataKey);
              return (
                <span style={{ color: isHidden ? '#999' : '#333' }}>
                  {value}
                </span>
              );
            }}
          />
          <Bar
            dataKey="longTerm"
            name="Long Term"
            fill="#0EA5E9"
            stackId="stack"
          />
          <Bar
            dataKey="spot"
            name="Spot"
            fill="#F59E0B"
            stackId="stack"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}