import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Period = "monthly" | "quarterly" | "yearly";

// Sample data generation for demonstration
const generateData = (period: Period) => {
  const currentDate = new Date();
  const data = [];
  
  switch (period) {
    case "monthly":
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        data.push({
          period: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          volume: Math.floor(Math.random() * (600 - 300) + 300)
        });
      }
      break;
    case "quarterly":
      for (let i = 3; i >= 0; i--) {
        const quarterMonth = Math.floor((currentDate.getMonth() - (i * 3)) / 3) * 3;
        const date = new Date(currentDate.getFullYear(), quarterMonth, 1);
        data.push({
          period: `Q${Math.floor(date.getMonth() / 3) + 1} '${date.getFullYear().toString().slice(-2)}`,
          volume: Math.floor(Math.random() * (1800 - 900) + 900)
        });
      }
      break;
    case "yearly":
      for (let i = 4; i >= 0; i--) {
        const year = currentDate.getFullYear() - i;
        data.push({
          period: year.toString(),
          volume: Math.floor(Math.random() * (7200 - 3600) + 3600)
        });
      }
      break;
  }
  return data;
};

export function LNGBarChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");
  const data = useMemo(() => generateData(selectedPeriod), [selectedPeriod]);

  const { trendColor, percentageChange, currentValue } = useMemo(() => {
    if (data.length < 2) return { trendColor: "#4ADE80", percentageChange: 0, currentValue: 0 };
    const startValue = data[0].volume;
    const endValue = data[data.length - 1].volume;
    const change = ((endValue - startValue) / startValue) * 100;
    return {
      trendColor: endValue >= startValue ? "#4ADE80" : "#ef4444",
      percentageChange: change,
      currentValue: endValue
    };
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">LNG Import Volume</h2>
        <div className="flex items-center gap-4">
          <Select
            value={selectedPeriod}
            onValueChange={(value: Period) => setSelectedPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-right">
            <div className="text-lg font-semibold">{currentValue}M</div>
            <div 
              className={`text-sm ${
                percentageChange >= 0 ? "text-dashboard-green" : "text-red-500"
              }`}
            >
              {percentageChange >= 0 ? "+" : ""}{percentageChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="period"
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
            tickFormatter={(value) => `${value}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1E2D",
              border: "none",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="volume"
            fill={trendColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}