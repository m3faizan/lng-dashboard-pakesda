import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ChartData = {
  month: string;
  value: number;
  average: number;
};

export function LNGBarChart() {
  const [showDESSlope, setShowDESSlope] = useState(false);
  const [data, setData] = useState<ChartData[]>([]);
  const [showBars, setShowBars] = useState(true);
  const [showAverage, setShowAverage] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: response, error } = await supabase
        .from('LNG Port_Price_Import')
        .select('date, wAvg_DES, DES_Slope')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const processedData = response.map((item, index, array) => {
        const date = new Date(item.date);
        const value = showDESSlope ? Number(item.DES_Slope) : Number(item.wAvg_DES);
        
        // Calculate 3-month moving average
        const startIdx = Math.max(0, index - 1);
        const endIdx = Math.min(array.length - 1, index + 1);
        const avgWindow = array.slice(startIdx, endIdx + 1);
        const average = avgWindow.reduce((sum, curr) => 
          sum + (showDESSlope ? Number(curr.DES_Slope) : Number(curr.wAvg_DES)), 
          0
        ) / avgWindow.length;

        return {
          month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          value,
          average,
        };
      });

      setData(processedData);
    };

    fetchData();
  }, [showDESSlope]);

  const getYAxisLabel = () => {
    return showDESSlope ? "%" : "$/MMBtu";
  };

  const formatValue = (value: number) => {
    return showDESSlope ? `${value.toFixed(2)}%` : `$${value.toFixed(2)}`;
  };

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] w-full transition-all hover:ring-1 hover:ring-dashboard-blue/20 overflow-hidden">
      <div className="flex flex-col items-center pt-6">
        <div className="flex items-center gap-4 mb-4">
          <CardTitle className="text-xl font-semibold text-center">
            {showDESSlope ? "DES Slope" : "DES Price"}
          </CardTitle>
          <Toggle
            pressed={showDESSlope}
            onPressedChange={setShowDESSlope}
            className="data-[state=on]:bg-dashboard-blue"
          >
            {showDESSlope ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
          </Toggle>
        </div>
        <div className="flex gap-4 mb-4">
          <Toggle
            pressed={showBars}
            onPressedChange={setShowBars}
            className="data-[state=on]:bg-dashboard-blue"
          >
            Column
          </Toggle>
          <Toggle
            pressed={showAverage}
            onPressedChange={setShowAverage}
            className="data-[state=on]:bg-dashboard-blue"
          >
            Moving Average
          </Toggle>
        </div>
      </div>
      <CardContent className="h-[400px] px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
            <Legend />
            {showBars && (
              <Bar
                dataKey="value"
                name={showDESSlope ? "DES Slope" : "DES Price"}
                fill="#0EA5E9"
                opacity={showBars ? 1 : 0.3}
              />
            )}
            {showAverage && (
              <Bar
                dataKey="average"
                name="Moving Average"
                fill="#FEC6A1"
                opacity={showAverage ? 1 : 0.3}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}