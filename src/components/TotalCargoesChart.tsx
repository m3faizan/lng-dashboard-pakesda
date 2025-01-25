import { Card, CardContent } from "@/components/ui/card";
import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const timeframes = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "YTD", months: new Date().getMonth() },
  { label: "1Y", months: 12 },
  { label: "5Y", months: 60 },
  { label: "Max", months: 120 },
] as const;

const generateData = (months: number) => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  for (let i = 0; i <= months; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    data.push({
      month: currentDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
      cargoes: Math.floor(Math.random() * (30 - 15) + 15)
    });
  }
  return data;
};

export function TotalCargoesChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const data = useMemo(() => generateData(selectedTimeframe), [selectedTimeframe]);

  return (
    <Card className="bg-dashboard-navy border-0">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center pt-6">
          <h2 className="text-lg font-semibold">Total Number of Cargoes</h2>
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
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="cargoes"
              stroke="#4ADE80"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
