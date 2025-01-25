import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generateData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);

  for (let i = 0; i <= 12; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    data.push({
      month: currentDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
      charges: (Math.random() * (0.6 - 0.3) + 0.3).toFixed(2)
    });
  }
  return data;
};

export function PortChargesChart() {
  const data = generateData();

  return (
    <Card className="bg-dashboard-navy border-0">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center pt-6">
          <h2 className="text-lg font-semibold">Port Charges ($/MMBtu)</h2>
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
              dataKey="charges"
              stroke="#4fd1c5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}