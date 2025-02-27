
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer } from "./charts/shared/ChartContainer";
import { useIsMobile } from "@/hooks/use-mobile";

export function TotalCargoesChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const { data: response, error } = await supabase
        .from('LNG Information')
        .select('date, Total_Cargoes')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const formattedData = response.map((item) => ({
        month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
        cargoes: item.Total_Cargoes || 0
      }));

      // For mobile, limit the data points to improve performance
      const mobileData = isMobile 
        ? formattedData.filter((_, index) => index % 2 === 0 || index === formattedData.length - 1)
        : formattedData;

      setData(mobileData);
      setIsLoading(false);
    };

    fetchData();
  }, [isMobile]);

  const chartMargin = isMobile
    ? { top: 5, right: 5, left: 25, bottom: 50 }
    : { top: 10, right: 30, left: 50, bottom: 40 };

  if (isLoading) {
    return (
      <ChartContainer title="Total Number of Cargoes" className="h-[300px]">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer 
      title="Total Number of Cargoes"
      className="h-[300px]"
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
            width={25}
            tickCount={5}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1E2D",
              border: "none",
              borderRadius: "8px",
              fontSize: isMobile ? "10px" : "12px",
              padding: "8px",
            }}
            formatter={(value: number) => [`${value}`, 'LNG Cargoes']}
          />
          <Line
            type="monotone"
            dataKey="cargoes"
            stroke="#39FF14"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
