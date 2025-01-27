import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", payment: 150 },
  { month: "Feb", payment: 180 },
  { month: "Mar", payment: 200 },
  { month: "Apr", payment: 220 },
  { month: "May", payment: 250 },
  { month: "Jun", payment: 230 },
  { month: "Jul", payment: 240 },
  { month: "Aug", payment: 260 },
  { month: "Sep", payment: 240 },
  { month: "Oct", payment: 220 },
  { month: "Nov", payment: 200 },
  { month: "Dec", payment: 210 },
];

export function ImportPaymentChart() {
  return (
    <Card className="bg-dashboard-navy border-0 h-[400px]">
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-lg font-semibold text-center">Import Payment Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px] p-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
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
            <Legend 
              verticalAlign="bottom"
              align="center"
              height={36}
            />
            <Line
              type="linear"
              dataKey="payment"
              stroke="#9b87f5"
              strokeWidth={2}
              dot={{ fill: "#9b87f5" }}
              name="Payment"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}