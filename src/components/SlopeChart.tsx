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
} from "recharts";

const data = [
  { month: "Jan", thisYear: 10.25, lastYear: 9.5 },
  { month: "Feb", thisYear: 9.8, lastYear: 9.2 },
  { month: "Mar", thisYear: 10.1, lastYear: 9.8 },
  { month: "Apr", thisYear: 9.9, lastYear: 9.3 },
  { month: "May", thisYear: 10.3, lastYear: 9.7 },
  { month: "Jun", thisYear: 10.0, lastYear: 9.4 },
];

interface SlopeChartProps {
  title?: string;
  showPrice?: boolean;
}

export function SlopeChart({ title = "Slope", showPrice = false }: SlopeChartProps) {
  return (
    <Card className="bg-dashboard-navy border-0 h-[400px]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-dashboard-teal"></div>
            <span className="text-sm text-muted-foreground">This Year</span>
            <span className="text-sm font-semibold">10.25%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#E879F9]"></div>
            <span className="text-sm text-muted-foreground">Last Year</span>
            <span className="text-sm font-semibold">9.5%</span>
          </div>
          {showPrice && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-muted-foreground">Price ($/MMBtu)</span>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height="100%">
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
              type="linear"
              dataKey="thisYear"
              stroke="#4fd1c5"
              strokeWidth={2}
              dot={{ fill: "#4fd1c5" }}
            />
            <Line
              type="linear"
              dataKey="lastYear"
              stroke="#E879F9"
              strokeWidth={2}
              dot={{ fill: "#E879F9" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}