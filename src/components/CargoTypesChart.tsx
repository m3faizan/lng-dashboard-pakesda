import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  {
    name: "Long Term",
    value: 18,
    color: "#0EA5E9"
  },
  {
    name: "Spot",
    value: 6,
    color: "#FEC6A1"
  }
];

export function CargoTypesChart() {
  return (
    <Card className="bg-dashboard-navy border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Cargo Types Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#94a3b8" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "1px solid #2D3748",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Bar
              dataKey="value"
              fill="#0EA5E9"
              radius={[0, 4, 4, 0]}
              background={{ fill: "#2D3748" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}