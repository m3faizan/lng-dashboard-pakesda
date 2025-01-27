import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = [
  { month: "Jan", rlng: 400, other: 600 },
  { month: "Feb", rlng: 300, other: 700 },
  { month: "Mar", rlng: 500, other: 500 },
  { month: "Apr", rlng: 600, other: 400 },
  { month: "May", rlng: 400, other: 600 },
  { month: "Jun", rlng: 300, other: 700 },
];

export function SystemGenerationChart() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-5">
        <h2 className="text-lg font-semibold">Total System Generation</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#525252" />
          <YAxis stroke="#525252" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1E2D",
              border: "none",
              borderRadius: "8px",
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => {
              const labels = {
                rlng: "RLNG",
                other: "Other Sources"
              };
              return labels[value as keyof typeof labels];
            }}
          />
          <Bar dataKey="rlng" stackId="a" fill="#4ADE80" />
          <Bar dataKey="other" stackId="a" fill="#0EA5E9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}