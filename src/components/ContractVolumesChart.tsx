import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample data - you can replace with actual data
const data = [
  { month: "Aug", longTerm: 45000, shortTerm: 30000 },
  { month: "Sep", longTerm: 48000, shortTerm: 32000 },
  { month: "Oct", longTerm: 46000, shortTerm: 35000 },
  { month: "Nov", longTerm: 50000, shortTerm: 38000 },
  { month: "Dec", longTerm: 55000, shortTerm: 42000 },
  { month: "Jan", longTerm: 58000, shortTerm: 45000 },
];

export function ContractVolumesChart() {
  return (
    <Card className="bg-dashboard-navy border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Contract Volumes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1E2D",
                  border: "none",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`$${value}`, ""]}
              />
              <Line
                type="monotone"
                dataKey="longTerm"
                stroke="#4ADE80"
                strokeWidth={2}
                dot={false}
                name="Long Term"
              />
              <Line
                type="monotone"
                dataKey="shortTerm"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
                name="Short Term"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}