import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer } from "./shared/ChartContainer";
import { ChartTooltip } from "./shared/ChartTooltip";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
export function LNGDESPriceChart() {
  const isMobile = useIsMobile();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const {
    data: chartData = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["lng-des-price", selectedYear],
    queryFn: async () => {
      let query = supabase.from("LNG Port_Price_Import").select("date, wAvg_DES").order("date");
      if (selectedYear !== "all") {
        const year = parseInt(selectedYear);
        const startDate = new Date(year, 0, 1).toISOString();
        const endDate = new Date(year, 11, 31).toISOString();
        query = query.gte("date", startDate).lte("date", endDate);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data.map(item => ({
        date: new Date(item.date as string).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        }),
        price: Number(item.wAvg_DES)
      }));
    }
  });

  // Get available years from data
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i.toString());
    }
    return years;
  };
  const years = getAvailableYears();
  const chartMargin = isMobile ? {
    top: 5,
    right: 5,
    left: 35,
    bottom: 50
  } : {
    top: 10,
    right: 30,
    left: 60,
    bottom: 40
  };
  if (isLoading) {
    return <ChartContainer title="LNG DES Price">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </ChartContainer>;
  }
  if (error) {
    return <ChartContainer title="LNG DES Price">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-red-500">Error loading data</p>
        </div>
      </ChartContainer>;
  }
  const yearSelector = <div className="flex gap-2 flex-wrap justify-center mx-[20px]">
      <button onClick={() => setSelectedYear("all")} className={`px-2 py-1 text-xs rounded-md ${selectedYear === "all" ? "bg-dashboard-green text-black" : "bg-dashboard-dark/50 text-muted-foreground"}`}>
        All
      </button>
      {years.map(year => <button key={year} onClick={() => setSelectedYear(year)} className={`px-2 py-1 text-xs rounded-md ${selectedYear === year ? "bg-dashboard-green text-black" : "bg-dashboard-dark/50 text-muted-foreground"}`}>
          {year}
        </button>)}
    </div>;
  return <ChartContainer title="LNG DES Price" headerContent={yearSelector} className="h-[350px]">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={chartMargin}>
            <XAxis dataKey="date" stroke="#525252" fontSize={isMobile ? 10 : 12} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={45} interval={isMobile ? "preserveEnd" : "preserveStartEnd"} tickCount={isMobile ? 4 : undefined} />
            <YAxis stroke="#525252" fontSize={isMobile ? 10 : 12} tickLine={false} axisLine={false} tickFormatter={value => `$${value}`} width={35} />
            <Tooltip content={({
            active,
            payload
          }) => <ChartTooltip active={active} payload={payload} valueFormatter={value => `$${value.toFixed(2)}/MMBtu`} labelFormatter={() => "Price"} />} />
            <Line type="monotone" dataKey="price" stroke="#4ADE80" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>;
}