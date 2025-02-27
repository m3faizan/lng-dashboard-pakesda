
import { ChartContainer } from "@/components/charts/shared/ChartContainer";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export function GenerationChart() {
  const isMobile = useIsMobile();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      let query = supabase
        .from('LNG Power Gen')
        .select('date, powerGeneration')
        .order('date', { ascending: true });
        
      if (selectedYear !== "all") {
        const year = parseInt(selectedYear);
        const startDate = new Date(year, 0, 1).toISOString();
        const endDate = new Date(year, 11, 31).toISOString();
        query = query.gte("date", startDate).lte("date", endDate);
      }
      
      const { data: response, error } = await query;

      if (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        return;
      }

      const formattedData = response.map((item) => ({
        month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
        generation: item.powerGeneration || 0
      }));

      // For mobile, limit the data points to improve performance
      const mobileData = isMobile 
        ? formattedData.filter((_, index) => index % 2 === 0 || index === formattedData.length - 1)
        : formattedData;

      setData(mobileData);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear, isMobile]);

  // Get available years
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i.toString());
    }
    return years;
  };
  
  const years = getAvailableYears();
  
  const chartMargin = isMobile
    ? { top: 5, right: 5, left: 30, bottom: 50 }
    : { top: 10, right: 30, left: 60, bottom: 40 };

  const yearSelector = (
    <div className="flex gap-2 flex-wrap justify-center">
      <button
        onClick={() => setSelectedYear("all")}
        className={`px-2 py-1 text-xs rounded-md ${
          selectedYear === "all"
            ? "bg-dashboard-green text-black"
            : "bg-dashboard-dark/50 text-muted-foreground"
        }`}
      >
        All
      </button>
      {years.map((year) => (
        <button
          key={year}
          onClick={() => setSelectedYear(year)}
          className={`px-2 py-1 text-xs rounded-md ${
            selectedYear === year
              ? "bg-dashboard-green text-black"
              : "bg-dashboard-dark/50 text-muted-foreground"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <ChartContainer 
        title="RLNG Power Generation (GWh)" 
        headerContent={yearSelector}
        className="h-[350px]"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer 
      title="RLNG Power Generation (GWh)" 
      headerContent={yearSelector}
      className="h-[350px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={chartMargin}
        >
          <XAxis
            dataKey="month"
            stroke="#525252"
            fontSize={isMobile ? 9 : 12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={45}
            interval={isMobile ? "equidistantPreserveStart" : "preserveStartEnd"}
          />
          <YAxis
            stroke="#525252"
            fontSize={isMobile ? 9 : 12}
            tickLine={false}
            axisLine={false}
            width={30}
            tickCount={5}
            tickFormatter={(value) => `${(value/1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1E2D",
              border: "none",
              borderRadius: "8px",
              fontSize: isMobile ? "10px" : "12px",
              padding: "8px",
            }}
            formatter={(value: number) => [`${value.toFixed(2)} GWh`, 'Generation']}
          />
          <Line
            type="monotone"
            dataKey="generation"
            stroke="#4ADE80"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
