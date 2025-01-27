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
  { month: "Jan", price: 100 },
  { month: "Feb", price: 120 },
  { month: "Mar", price: 200 },
  { month: "Apr", price: 350 },
  { month: "May", price: 400 },
  { month: "Jun", price: 350 },
  { month: "Jul", price: 380 },
  { month: "Aug", price: 300 },
  { month: "Sep", price: 250 },
  { month: "Oct", price: 200 },
  { month: "Nov", price: 150 },
  { month: "Dec", price: 180 },
];

export function PriceChart() {
  return (
    <Card className="bg-dashboard-navy border-0 h-[400px]">
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-lg font-semibold text-center">LNG DES Price</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px] p-5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4fd1c5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4fd1c5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="#DDD"
              fontSize={12}
              fontFamily="Arial"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#DDD"
              fontSize={12}
              fontFamily="Arial"
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
                fontFamily: "Arial",
                fontSize: "12px",
              }}
            />
            <Area
              type="linear"
              dataKey="price"
              stroke="#4fd1c5"
              fill="url(#colorPrice)"
              strokeWidth={2}
              name="Price"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}