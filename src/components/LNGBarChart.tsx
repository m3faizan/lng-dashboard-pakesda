
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

type ChartData = {
  period: string;
  value: number;
};

export function LNGBarChart() {
  const [showDESSlope, setShowDESSlope] = useState(false);
  const [data, setData] = useState<ChartData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      // First, get the most recent date
      const { data: latestData } = await supabase
        .from('LNG Port_Price_Import')
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
        .from('LNG Port_Price_Import')
        .select('date, wAvg_DES, DES_Slope')
        .gte('date', startDate.toISOString())
        .lte('date', latestDate.toISOString())
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const processedData = response.map((item) => {
        const date = new Date(item.date);
        const value = showDESSlope ? Number(item.DES_Slope) : Number(item.wAvg_DES);

        return {
          period: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          value,
        };
      });

      setData(processedData);
    };

    fetchData();
  }, [showDESSlope, selectedTimeframe]);

  const getYAxisLabel = () => {
    return showDESSlope ? "%" : "$/MMBtu";
  };

  const formatValue = (value: number) => {
    return showDESSlope ? `${value.toFixed(2)}%` : `$${value.toFixed(2)}`;
  };

  const timeframes = [
    { label: "3M", months: 3 },
    { label: "6M", months: 6 },
    { label: "YTD", months: new Date().getMonth() },
    { label: "1Y", months: 12 },
    { label: "5Y", months: 60 },
    { label: "Max", months: 120 },
  ];

  const chartMargin = isMobile 
    ? { top: 20, right: 10, left: 40, bottom: 60 }
    : { top: 20, right: 30, left: 60, bottom: 20 };

  return (
    <Card className="bg-dashboard-navy border-0 h-[350px] md:h-[480px] w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg overflow-hidden">
      <div className="flex flex-col items-center pt-4 md:pt-6">
        <CardTitle className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
          LNG Price
        </CardTitle>
        <Select
          value={showDESSlope ? "slope" : "price"}
          onValueChange={(value) => setShowDESSlope(value === "slope")}
        >
          <SelectTrigger className="w-[160px] md:w-[180px] mb-2 md:mb-4 hover:bg-dashboard-navy/80">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">DES Price</SelectItem>
            <SelectItem value="slope">DES Slope</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <CardContent className="h-[250px] md:h-[400px] px-2 md:px-4">
        <ResponsiveContainer width="100%" height="75%">
          <LineChart 
            data={data}
            margin={chartMargin}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              stroke="#525252"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={isMobile ? 1 : "preserveStartEnd"}
            />
            <YAxis
              stroke="#525252"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              width={isMobile ? 40 : 60}
              label={{
                value: getYAxisLabel(),
                angle: -90,
                position: 'insideLeft',
                style: { 
                  fill: '#94a3b8',
                  fontSize: isMobile ? 10 : 12
                }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
                fontSize: isMobile ? "12px" : "14px",
              }}
              formatter={(value: number) => [formatValue(value)]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-1 md:gap-2 mt-4 md:mt-8 mb-4 md:mb-8">
          {timeframes.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setSelectedTimeframe(tf.months)}
              className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm ${
                selectedTimeframe === tf.months
                  ? "bg-dashboard-blue text-white"
                  : "bg-dashboard-dark/50 text-muted-foreground hover:bg-dashboard-dark"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
