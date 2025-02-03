import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", price: 200 },
  { month: "Feb", price: 250 },
  { month: "Mar", price: 400 },
  { month: "Apr", price: 450 },
  { month: "May", price: 400 },
  { month: "Jun", price: 500 },
  { month: "Jul", price: 450 },
  { month: "Aug", price: 400 },
  { month: "Sep", price: 350 },
  { month: "Oct", price: 300 },
  { month: "Nov", price: 250 },
  { month: "Dec", price: 300 },
];

export function BrentChart() {
  return (
    <Card className="bg-dashboard-navy border-0 h-[400px] transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold">3M Avg. Brent</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FEC6A1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FEC6A1" stopOpacity={0} />
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
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
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
              dataKey="price"
              stroke="#FEC6A1"
              fill="url(#colorBrent)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}