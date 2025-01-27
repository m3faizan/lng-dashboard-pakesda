import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useMemo } from "react";

// Extended sample data for demonstration
const generateData = (months: number) => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  for (let i = 0; i <= months; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    data.push({
      month: currentDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
      volume: Math.floor(Math.random() * (600 - 300) + 300)
    });
  }
  return data;
};

const timeframes = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "YTD", months: new Date().getMonth() },
  { label: "1Y", months: 12 },
  { label: "5Y", months: 60 },
  { label: "Max", months: 120 },
] as const;

export function LNGChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const data = generateData(selectedTimeframe);

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
        <div className="flex items-center gap-4">
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
      
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={trendColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
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
          <Area
            type="linear"
            dataKey="volume"
            stroke={trendColor}
            fillOpacity={1}
            fill="url(#colorVolume)"
          />
        </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
