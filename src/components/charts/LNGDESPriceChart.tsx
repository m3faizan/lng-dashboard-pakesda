
import { useQuery } from "@tanstack/react-query";
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { ChartContainer } from "./shared/ChartContainer";
import { ChartTooltip } from "./shared/ChartTooltip";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useMemo } from "react";

type PriceDataPoint = {
  date: string;
  price: number;
  formattedDate: string;
  originalDate: Date;
};

export function LNGDESPriceChart() {
  const isMobile = useIsMobile();
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // Fetch data with query optimizations
  const {
    data: rawChartData = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["lng-des-price", selectedYear],
    queryFn: async () => {
      let query = supabase
        .from("LNG Port_Price_Import")
        .select("date, wAvg_DES")
        .order("date");
      
      if (selectedYear !== "all") {
        const year = parseInt(selectedYear);
        const startDate = new Date(year, 0, 1).toISOString();
        const endDate = new Date(year, 11, 31).toISOString();
        query = query.gte("date", startDate).lte("date", endDate);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data.map(item => {
        const itemDate = new Date(item.date as string);
        return {
          date: itemDate.toLocaleString("en-US", {
            month: "short",
            year: "numeric"
          }),
          price: Number(item.wAvg_DES),
          formattedDate: itemDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric"
          }),
          originalDate: itemDate
        };
      });
    }
  });

  // Optimize data points for display based on selected year and device
  const chartData = useMemo(() => {
    if (!rawChartData.length) return [];
    
    // For "all" time period, reduce data density
    if (selectedYear === "all") {
      // For mobile, show quarterly data
      if (isMobile) {
        const quarterlyData: Record<string, PriceDataPoint> = {};
        
        rawChartData.forEach(item => {
          const date = item.originalDate;
          const quarter = Math.floor(date.getMonth() / 3);
          const quarterKey = `${date.getFullYear()}-Q${quarter + 1}`;
          
          if (!quarterlyData[quarterKey]) {
            quarterlyData[quarterKey] = {
              ...item,
              date: `Q${quarter + 1} ${date.getFullYear()}`,
              price: item.price,
              count: 1
            };
          } else {
            quarterlyData[quarterKey].price = 
              (quarterlyData[quarterKey].price * quarterlyData[quarterKey].count + item.price) / 
              (quarterlyData[quarterKey].count + 1);
            quarterlyData[quarterKey].count += 1;
          }
        });
        
        return Object.values(quarterlyData).sort(
          (a, b) => a.originalDate.getTime() - b.originalDate.getTime()
        );
      }
      
      // For desktop, show monthly data but skip some months for clarity
      return rawChartData.filter((_, index) => 
        index === 0 || 
        index === rawChartData.length - 1 || 
        index % (isMobile ? 6 : 2) === 0
      );
    }
    
    // For single year view, reduce data points for mobile
    if (isMobile && rawChartData.length > 6) {
      return rawChartData.filter((_, index) => 
        index === 0 || 
        index === rawChartData.length - 1 || 
        index % 2 === 0
      );
    }
    
    return rawChartData;
  }, [rawChartData, selectedYear, isMobile]);

  // Get available years from actual data
  const availableYears = useMemo(() => {
    const yearSet = new Set<string>();
    rawChartData.forEach(item => {
      const year = item.originalDate.getFullYear().toString();
      yearSet.add(year);
    });
    
    return Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, [rawChartData]);

  // Optimized margins based on device
  const chartMargin = useMemo(() => isMobile 
    ? { top: 15, right: 12, left: 45, bottom: 35 }
    : { top: 20, right: 30, left: 60, bottom: 40 }, 
  [isMobile]);

  // Loading and error states
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

  // Year selector with improved UI and UX
  const yearSelector = (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 hide-scrollbar justify-center">
      <button 
        onClick={() => setSelectedYear("all")} 
        className={`px-3 py-1.5 text-xs rounded-md min-w-16 transition-colors ${
          selectedYear === "all" 
            ? "bg-dashboard-green text-black font-medium" 
            : "bg-dashboard-dark/60 text-muted-foreground hover:bg-dashboard-dark"
        }`}
      >
        All
      </button>
      {availableYears.map(year => (
        <button 
          key={year} 
          onClick={() => setSelectedYear(year)} 
          className={`px-3 py-1.5 text-xs rounded-md min-w-16 transition-colors ${
            selectedYear === year 
              ? "bg-dashboard-green text-black font-medium" 
              : "bg-dashboard-dark/60 text-muted-foreground hover:bg-dashboard-dark"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );

  return (
    <ChartContainer 
      title="LNG DES Price" 
      headerContent={yearSelector}
      className={isMobile ? "h-[330px]" : "h-[480px]"}
    >
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              stroke="#525252" 
              fontSize={isMobile ? 11 : 12} 
              tickLine={false} 
              axisLine={false} 
              angle={-45} 
              textAnchor="end" 
              height={45} 
              interval={isMobile ? "preserveStartEnd" : "preserveEnd"} 
              tickCount={isMobile ? 4 : undefined} 
            />
            <YAxis 
              stroke="#525252" 
              fontSize={isMobile ? 11 : 12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={value => `$${value}`} 
              width={isMobile ? 45 : 60} 
              label={{ 
                value: "$/MMBtu",
                angle: -90,
                position: 'left',
                offset: -10,
                style: {
                  fontSize: '12px',
                  fill: '#525252',
                  textAnchor: 'middle'
                }
              }}
            />
            <Tooltip 
              content={({active, payload}) => (
                <ChartTooltip 
                  active={active} 
                  payload={payload} 
                  valueFormatter={value => `$${value.toFixed(2)}/MMBtu`} 
                  labelFormatter={() => "Price"} 
                />
              )} 
              wrapperStyle={{ zIndex: 100 }}
              position={{ y: -40 }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#4ADE80" 
              strokeWidth={2.5} 
              dot={isMobile ? { r: 4, strokeWidth: 1 } : { r: 0 }}
              activeDot={{ r: 6, strokeWidth: 1.5, fill: "#4ADE80" }} 
              connectNulls={true}
              isAnimationActive={!isMobile}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
