import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { month: "Aug", longTerm: 1.2, shortTerm: 0.8 },
  { month: "Sep", longTerm: 1.3, shortTerm: 0.7 },
  { month: "Oct", longTerm: 1.4, shortTerm: 0.9 },
  { month: "Nov", longTerm: 1.5, shortTerm: 1.1 },
  { month: "Dec", longTerm: 1.8, shortTerm: 1.2 },
  { month: "Jan", longTerm: 1.7, shortTerm: 1.0 },
];

export function ContractVolumesChart() {
  return (
    <Card className="bg-dashboard-navy border-0 h-[400px]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold">
          Contract Volumes (MMBtu)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1E2D",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="longTerm"
                name="Long Term"
                stroke="#4ADE80"
                strokeWidth={2}
                dot={{ fill: "#4ADE80" }}
              />
              <Line
                type="monotone"
                dataKey="shortTerm"
                name="Short Term"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={{ fill: "#0EA5E9" }}
              />
            </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
