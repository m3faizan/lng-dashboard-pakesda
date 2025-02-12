
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

const timeframes = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "YTD", months: new Date().getMonth() },
  { label: "1Y", months: 12 },
  { label: "5Y", months: 60 },
  { label: "Max", months: 120 },
] as const;

export function TotalCargoesChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // First, get the most recent date
      const { data: latestData } = await supabase
        .from('LNG Information')
        .select('date')
        .order('date', { ascending: false })
        .limit(1);

      if (!latestData || latestData.length === 0) return;

      const latestDate = new Date(latestData[0].date);
      const startDate = new Date(latestDate);

      // For YTD, use current year's start
      if (selectedTimeframe === new Date().getMonth()) {
        startDate.setFullYear(new Date().getFullYear(), 0, 1); // January 1st of current year
      } else {
        // For other timeframes, go back X-1 months from latest date
        // We subtract 1 from the selectedTimeframe because we want the current month plus X-1 previous months
        startDate.setMonth(latestDate.getMonth() - (selectedTimeframe - 1));
        startDate.setDate(1);
      }

      startDate.setHours(0, 0, 0, 0);

      const { data: response, error } = await supabase
        .from('LNG Information')
        .select('date, Total_Cargoes')
        .gte('date', startDate.toISOString())
        .lte('date', latestDate.toISOString())
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const formattedData = response.map((item) => ({
        month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
        cargoes: item.Total_Cargoes || 0
      }));

      setData(formattedData);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedTimeframe]);

  const chartMargin = isMobile
    ? { top: 5, right: 5, left: 35, bottom: 50 }
    : { top: 10, right: 30, left: 50, bottom: 40 };

  const timeframeButtons = (
    <div className="flex gap-2">
      {timeframes.map((tf) => (
        <button
          key={tf.label}
          onClick={() => setSelectedTimeframe(tf.months)}
          className={`px-3 py-1 rounded-md text-sm ${
            selectedTimeframe === tf.months
              ? "bg-dashboard-green text-black"
              : "bg-dashboard-dark/50 text-muted-foreground hover:bg-dashboard-dark"
          }`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <ChartContainer title="Total Number of Cargoes">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer 
      title="Total Number of Cargoes"
      headerContent={timeframeButtons}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={chartMargin}
        >
          <XAxis
            dataKey="month"
            stroke="#525252"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={45}
            interval={isMobile ? "preserveEnd" : "preserveStartEnd"}
          />
          <YAxis
            stroke="#525252"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 35 : 50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1E2D",
              border: "none",
              borderRadius: "8px",
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
