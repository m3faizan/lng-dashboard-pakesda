import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const yearColors: Record<string, string> = {
  "2019": "#0EA5E9", // blue
  "2020": "#4ADE80", // green
  "2021": "#F472B6", // pink
  "2022": "#FB923C", // orange
  "2023": "#A78BFA", // purple
  "2024": "#FBBF24", // yellow
};

export function ImportVolumeChart() {
  const [data, setData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: importData, error } = await supabase
          .from('LNG Information')
          .select('date, import_Volume')
          .gte('date', '2019-01-01')
          .lte('date', '2024-12-31')
          .order('date', { ascending: true });

        if (error) {
          console.error('Error fetching data:', error);
          return;
        }

        // Transform data and group by year/month
        const transformedData = importData.reduce((acc: any, curr) => {
          if (!curr.date || curr.import_Volume === null) return acc;
          
          const date = new Date(curr.date);
          const year = date.getFullYear().toString();
          const month = date.toLocaleString('default', { month: 'short' });
          const key = month;
          
          if (!acc[key]) {
            acc[key] = {
              month: month,
              fullDate: date,
            };
          }
          
          acc[key][year] = Number(curr.import_Volume);
          return acc;
        }, {});

        // Convert to array and sort by date
        const chartData = Object.values(transformedData).sort(
          (a: any, b: any) => a.fullDate - b.fullDate
        );

        // Get unique years from data
        const uniqueYears = Array.from(
          new Set(importData.map((item) => new Date(item.date).getFullYear().toString()))
        ).sort();

        setYears(uniqueYears);
        setSelectedYears(uniqueYears);
        setData(chartData);
      } catch (error) {
        console.error('Error processing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleYear = (year: string) => {
    setSelectedYears((prev) => {
      const newSelection = prev.includes(year)
        ? prev.filter((y) => y !== year)
        : [...prev, year];
      
      // Ensure at least one year remains selected
      return newSelection.length > 0 ? newSelection : [year];
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-dashboard-navy border-0 h-[400px]">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-semibold">Import Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading data...</div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const filteredPayload = payload.filter((entry: any) => 
      selectedYears.includes(entry.dataKey)
    );

    return (
      <div className="bg-dashboard-navy p-2 border border-gray-700 rounded-lg text-xs">
        <p className="mb-1 font-medium">{label}</p>
        {filteredPayload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: yearColors[entry.dataKey] }}>
            {entry.dataKey}: {(entry.value / 1000000).toFixed(2)}M MMBtu
          </p>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-dashboard-navy border-0 h-[400px]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold">Import Volume</CardTitle>
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
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onClick={(e) => toggleYear(e.value)}
              formatter={(value) => (
                <span
                  style={{
                    color: selectedYears.includes(value)
                      ? "#fff"
                      : "#4b5563",
                  }}
                >
                  {value}
                </span>
              )}
            />
            {years.map((year) => (
              <Line
                key={year}
                type="linear"
                dataKey={year}
                name={year}
                stroke={yearColors[year]}
                strokeWidth={year === "2024" ? 3 : 2}
                dot={false}
                opacity={selectedYears.includes(year) ? 1 : 0.2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
