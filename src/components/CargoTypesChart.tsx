import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const yearlyData = {
  "2024": [
    { month: "Jan", longTerm: 4, spot: 1 },
    { month: "Feb", longTerm: 3, spot: 2 },
    { month: "Mar", longTerm: 5, spot: 0 },
    { month: "Apr", longTerm: 4, spot: 1 },
    { month: "May", longTerm: 3, spot: 1 },
    { month: "Jun", longTerm: 4, spot: 2 },
    { month: "Jul", longTerm: 5, spot: 1 },
    { month: "Aug", longTerm: 3, spot: 2 },
    { month: "Sep", longTerm: 4, spot: 1 },
    { month: "Oct", longTerm: 5, spot: 0 },
    { month: "Nov", longTerm: 3, spot: 1 },
    { month: "Dec", longTerm: 4, spot: 2 },
  ],
  "2023": [
    { month: "Jan", longTerm: 3, spot: 2 },
    { month: "Feb", longTerm: 4, spot: 1 },
    { month: "Mar", longTerm: 3, spot: 1 },
    { month: "Apr", longTerm: 5, spot: 0 },
    { month: "May", longTerm: 4, spot: 2 },
    { month: "Jun", longTerm: 3, spot: 1 },
    { month: "Jul", longTerm: 4, spot: 1 },
    { month: "Aug", longTerm: 5, spot: 0 },
    { month: "Sep", longTerm: 3, spot: 2 },
    { month: "Oct", longTerm: 4, spot: 1 },
    { month: "Nov", longTerm: 5, spot: 1 },
    { month: "Dec", longTerm: 3, spot: 2 },
  ],
};

export function CargoTypesChart() {
  const [selectedYear, setSelectedYear] = useState("2024");

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] transition-all hover:ring-1 hover:ring-dashboard-blue/20 overflow-hidden">
      <div className="flex flex-col items-center pt-6">
        <CardTitle className="text-xl font-semibold mb-4 text-center">
          Cargo Types Distribution
        </CardTitle>
        <Select
          value={selectedYear}
          onValueChange={(value) => setSelectedYear(value)}
        >
          <SelectTrigger className="w-[180px] mb-4 hover:bg-dashboard-navy/80">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={yearlyData[selectedYear]}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 45 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="month"
              tick={{ fill: "#94a3b8" }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "1px solid #2D3748",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{
                paddingTop: "12px",
                fontSize: "12px",
                display: "flex",
                justifyContent: "center",
                gap: "1rem"
              }}
            />
            <Bar
              dataKey="longTerm"
              name="Long Term"
              fill="#0EA5E9"
              radius={[0, 4, 4, 0]}
              stackId="a"
            />
            <Bar
              dataKey="spot"
              name="Spot"
              fill="#FEC6A1"
              radius={[0, 4, 4, 0]}
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}