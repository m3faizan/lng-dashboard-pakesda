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
import { TimeFrameSelector } from "./charts/TimeFrameSelector";

type ChartData = {
  month: string;
  value: number;
};

const timeframes = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "YTD", months: new Date().getMonth() },
  { label: "1Y", months: 12 },
  { label: "5Y", months: 60 },
  { label: "Max", months: 120 },
] as const;

export function LNGBarChart() {
  const [showDESSlope, setShowDESSlope] = useState(false);
  const [data, setData] = useState<ChartData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12); // Default to 1Y

  useEffect(() => {
    const fetchData = async () => {
      // Calculate date range based on selected timeframe
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - selectedTimeframe);
      
      const { data: response, error } = await supabase
        .from('LNG Port_Price_Import')
        .select('date, wAvg_DES, DES_Slope')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const processedData = response.map((item) => {
        const date = new Date(item.date);
        const value = showDESSlope ? Number(item.DES_Slope) : Number(item.wAvg_DES);

        return {
          month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
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

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] w-full transition-all hover:ring-1 hover:ring-dashboard-blue/20 overflow-hidden">
      <div className="flex flex-col items-center pt-6">
        <CardTitle className="text-xl font-semibold text-center mb-4">
          LNG Price
        </CardTitle>
        <div className="flex items-center gap-4 mb-4">
          <Select
            value={showDESSlope ? "slope" : "price"}
            onValueChange={(value) => setShowDESSlope(value === "slope")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">DES Price</SelectItem>
              <SelectItem value="slope">DES Slope</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TimeFrameSelector
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          color="dashboard-blue"
        />
      </div>
      <CardContent className="h-[400px] px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8" }}
            />
            <YAxis
              tick={{ fill: "#94a3b8" }}
              label={{
                value: getYAxisLabel(),
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#94a3b8' }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "1px solid #2D3748",
              }}
              formatter={(value: number) => [formatValue(value)]}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={showDESSlope ? "DES Slope" : "DES Price"}
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}