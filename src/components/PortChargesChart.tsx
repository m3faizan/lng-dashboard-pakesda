import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
    <Card className="bg-dashboard-navy border-0 h-[480px] w-full transition-all hover:ring-1 hover:ring-dashboard-blue/20 overflow-hidden">
      <div className="flex flex-col items-center pt-6 pb-2">
        <CardTitle className="text-lg font-semibold mb-4">Port Charges ($/MMBtu)</CardTitle>
      </div>
      <CardContent className="h-[400px] px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
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
