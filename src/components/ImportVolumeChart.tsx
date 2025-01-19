import { useState } from "react";
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

// Sample data - each year's monthly import volumes
const data = [
  { month: "Jan", "2020": 4, "2021": 3, "2022": 6 },
  { month: "Feb", "2020": 5, "2021": 7, "2022": 8 },
  { month: "Mar", "2020": 4, "2021": 6, "2022": 17 },
  { month: "Apr", "2020": 4, "2021": 10, "2022": null },
  { month: "May", "2020": 4, "2021": 8, "2022": null },
  { month: "Jun", "2020": 6, "2021": 10, "2022": null },
  { month: "Jul", "2020": 3, "2021": 8, "2022": null },
  { month: "Aug", "2020": 6, "2021": 7, "2022": null },
  { month: "Sep", "2020": 4, "2021": 9, "2022": null },
  { month: "Oct", "2020": 4, "2021": 7, "2022": null },
  { month: "Nov", "2020": 4, "2021": 11, "2022": null },
  { month: "Dec", "2020": 4, "2021": 7, "2022": null },
];

const years = ["2020", "2021", "2022"];
const yearColors: Record<string, string> = {
  "2020": "#0EA5E9", // Ocean Blue
  "2021": "#4ADE80", // Dashboard Green
  "2022": "#FEC6A1", // Coral
};

export function ImportVolumeChart() {
  const [selectedYears, setSelectedYears] = useState<string[]>([...years]);

  const toggleYear = (year: string | number | ((obj: any) => any)) => {
    if (typeof year === "function") return;
    const yearString = year.toString();
    setSelectedYears((prev) =>
      prev.includes(yearString)
        ? prev.filter((y) => y !== yearString)
        : [...prev, yearString]
    );
  };

  return (
    <Card className="bg-dashboard-navy border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Import Volume (MMBtu)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
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
              <Legend
                onClick={(e) => toggleYear(e.dataKey)}
                formatter={(value, entry) => (
                  <span
                    style={{
                      color: selectedYears.includes(value.toString())
                        ? "#fff"
                        : "#4b5563",
                    }}
                  >
                    {value}
                  </span>
                )}
              />
              {years.map((year) => (
                selectedYears.includes(year) && (
                  <Line
                    key={year}
                    type="monotone"
                    dataKey={year}
                    stroke={yearColors[year]}
                    strokeWidth={2}
                    dot={{ fill: yearColors[year] }}
                    activeDot={{ r: 6 }}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}