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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const data = [
  { month: "Jan", thisYear: 10.25, lastYear: 9.5 },
  { month: "Feb", thisYear: 9.8, lastYear: 9.2 },
  { month: "Mar", thisYear: 10.1, lastYear: 9.8 },
  { month: "Apr", thisYear: 9.9, lastYear: 9.3 },
  { month: "May", thisYear: 10.3, lastYear: 9.7 },
  { month: "Jun", thisYear: 10.0, lastYear: 9.4 },
  { month: "Jul", thisYear: 10.2, lastYear: 9.6 },
  { month: "Aug", thisYear: 10.4, lastYear: 9.8 },
  { month: "Sep", thisYear: 10.1, lastYear: 9.5 },
  { month: "Oct", thisYear: 10.3, lastYear: 9.7 },
  { month: "Nov", thisYear: 10.2, lastYear: 9.4 },
  { month: "Dec", thisYear: 10.25, lastYear: 9.5 },
];

interface SlopeChartProps {
  title?: string;
  showPrice?: boolean;
}

export function SlopeChart({ title = "Contract Slope", showPrice = false }: SlopeChartProps) {
  const [selectedYears, setSelectedYears] = useState<string[]>(["thisYear", "lastYear"]);
  const isMobile = useIsMobile();

  return (
    <Card className="bg-dashboard-navy border-0 h-[400px]">
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-base md:text-lg font-semibold text-center">{title}</CardTitle>
        <ToggleGroup 
          type="multiple" 
          value={selectedYears}
          onValueChange={(value) => {
            if (value.length > 0) setSelectedYears(value);
          }}
          className="mt-2 md:mt-4"
        >
          <ToggleGroupItem value="thisYear" className="text-xs md:text-sm px-2 md:px-3">This Year</ToggleGroupItem>
          <ToggleGroupItem value="lastYear" className="text-xs md:text-sm px-2 md:px-3">Last Year</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="h-[320px] p-2 md:p-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={isMobile ? 
              { top: 20, right: 20, left: 20, bottom: 60 } : 
              { top: 20, right: 30, left: 20, bottom: 30 }
            }
          >
            <XAxis
              dataKey="month"
              stroke="#DDD"
              fontSize={isMobile ? 10 : 12}
              fontFamily="Arial"
              tickLine={false}
              axisLine={false}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 50}
              interval={isMobile ? 1 : 0}
            />
            <YAxis
              stroke="#DDD"
              fontSize={isMobile ? 10 : 12}
              fontFamily="Arial"
              tickLine={false}
              axisLine={false}
              width={isMobile ? 40 : 60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
                fontFamily: "Arial",
                fontSize: isMobile ? "10px" : "12px",
              }}
            />
            <Legend 
              verticalAlign="bottom"
              align="center"
              height={36}
              wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }}
            />
            {selectedYears.includes("thisYear") && (
              <Line
                type="linear"
                dataKey="thisYear"
                stroke="#4fd1c5"
                strokeWidth={2}
                dot={{ fill: "#4fd1c5" }}
                name="2024"
              />
            )}
            {selectedYears.includes("lastYear") && (
              <Line
                type="linear"
                dataKey="lastYear"
                stroke="#222222"
                strokeWidth={2}
                dot={{ fill: "#222222" }}
                name="2023"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
