
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PriceTrendChart() {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const { data: rawData = [], isLoading, error } = useQuery({
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
        longTerm: Number(item.Long_Term_DES),
        spot: Number(item.Spot_DES),
      }));
    },
  });

  const years = useMemo(() => {
    if (!rawData.length) return ["all"];
    const uniqueYears = [...new Set(rawData.map(item => item.year))];
    return ["all", ...uniqueYears.sort((a, b) => b.localeCompare(a))];
  }, [rawData]);

  const chartData = useMemo(() => {
    if (!rawData) return [];
    return rawData
      .filter(item => selectedYear === "all" || item.year === selectedYear)
      .map(item => ({
        date: item.formattedDate,
        longTerm: hiddenSeries.includes("longTerm") ? 0 : item.longTerm,
        spot: hiddenSeries.includes("spot") ? 0 : item.spot
      }));
  }, [rawData, selectedYear, hiddenSeries]);

  const handleLegendClick = (entry: any) => {
    if (typeof entry.dataKey === 'string') {
      setHiddenSeries(prev => 
        prev.includes(entry.dataKey) 
          ? prev.filter(key => key !== entry.dataKey)
          : [...prev, entry.dataKey]
      );
    }
  };

  const chartMargin = isMobile
    ? { top: 5, right: 5, left: 35, bottom: 50 }
    : { top: 10, right: 30, left: 60, bottom: 40 };

  const YearSelector = (
    <Select
      value={selectedYear}
      onValueChange={setSelectedYear}
    >
      <SelectTrigger className="w-[140px] md:w-[180px]">
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

  if (isLoading) {
    return (
      <ChartContainer title="Price Trend" headerContent={YearSelector}>
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer title="Price Trend" headerContent={YearSelector}>
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-red-500">Error loading data</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer 
      title="Price Trend" 
      headerContent={YearSelector}
    >
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
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
              height={45}
              interval={isMobile ? "preserveEnd" : "preserveStartEnd"}
              tickCount={isMobile ? 6 : undefined}
            />
            <YAxis
              stroke="#525252"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              width={35}
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
              onClick={handleLegendClick}
              wrapperStyle={{ 
                paddingTop: isMobile ? "0.5rem" : "1rem",
                marginBottom: isMobile ? "-0.5rem" : "0"
              }}
              iconSize={isMobile ? 8 : 12}
              fontSize={isMobile ? 10 : 12}
            />
            <Bar
              dataKey="longTerm"
              name="Long Term"
              fill="#0EA5E9"
              hide={hiddenSeries.includes("longTerm")}
            />
            <Bar
              dataKey="spot"
              name="Spot"
              fill="#F59E0B"
              hide={hiddenSeries.includes("spot")}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
