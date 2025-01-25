import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useMemo } from "react";

type Period = "monthly" | "quarterly" | "yearly";

const generateData = (period: Period) => {
  const currentDate = new Date();
  const data = [];
  
  switch (period) {
    case "monthly":
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        data.push({
          period: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          EETL: Math.floor(Math.random() * (15 - 5) + 5),
          PGPCL: Math.floor(Math.random() * (15 - 5) + 5),
        });
      }
      break;
    case "quarterly":
      for (let i = 3; i >= 0; i--) {
        const quarterMonth = Math.floor((currentDate.getMonth() - (i * 3)) / 3) * 3;
        const date = new Date(currentDate.getFullYear(), quarterMonth, 1);
        data.push({
          period: `Q${Math.floor(date.getMonth() / 3) + 1} '${date.getFullYear().toString().slice(-2)}`,
          EETL: Math.floor(Math.random() * (45 - 15) + 15),
          PGPCL: Math.floor(Math.random() * (45 - 15) + 15),
        });
      }
      break;
    case "yearly":
      for (let i = 4; i >= 0; i--) {
        const year = currentDate.getFullYear() - i;
        data.push({
          period: year.toString(),
          EETL: Math.floor(Math.random() * (180 - 60) + 60),
          PGPCL: Math.floor(Math.random() * (180 - 60) + 60),
        });
      }
      break;
  }
  return data;
};

export function CargoActivityChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");
  const data = useMemo(() => generateData(selectedPeriod), [selectedPeriod]);

  return (
    <Card className="bg-dashboard-navy border-0">
      <div className="flex flex-col items-center pt-6 px-6">
        <h2 className="text-lg font-semibold mb-2">Cargo Activity by Terminal</h2>
        <Select
          value={selectedPeriod}
          onValueChange={(value: Period) => setSelectedPeriod(value)}
        >
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
      <CardContent className="mt-4">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="period"
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
            <Legend />
            <Bar dataKey="EETL" stackId="a" fill="#4ADE80" />
            <Bar dataKey="PGPCL" stackId="a" fill="#0EA5E9" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}