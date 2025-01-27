import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { month: "Jan", price: 15.2 },
  { month: "Feb", price: 14.8 },
  { month: "Mar", price: 15.5 },
  { month: "Apr", price: 16.2 },
  { month: "May", price: 15.8 },
  { month: "Jun", price: 15.4 },
  { month: "Jul", price: 15.9 },
  { month: "Aug", price: 16.5 },
  { month: "Sep", price: 16.1 },
  { month: "Oct", price: 15.7 },
  { month: "Nov", price: 15.3 },
  { month: "Dec", price: 15.6 },
];

export function PriceChart() {
  return (
    <Card className="bg-dashboard-navy border-0 h-[400px]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold">
          LNG DES Price
        </CardTitle>
        <div className="h-[44px]"></div> {/* Spacer to match height of charts with dropdowns */}
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
                fontFamily: "Arial",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value}`, "Price"]}
            />
            <Legend 
              verticalAlign="bottom"
              align="center"
              height={36}
            />
            <Area
              type="monotone"
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