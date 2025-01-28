import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
  ComposedChart,
  Line,
} from "recharts";
import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Period = "monthly" | "quarterly" | "yearly";

const formatDate = (date: Date, period: Period) => {
  switch (period) {
    case "monthly":
      return date.toLocaleString('default', { month: 'short', year: '2-digit' });
    case "quarterly":
      return `Q${Math.floor(date.getMonth() / 3) + 1} '${date.getFullYear().toString().slice(-2)}`;
    case "yearly":
      return date.getFullYear().toString();
  }
};

const generateEmptyPeriods = (startDate: Date, endDate: Date, period: Period) => {
  const periods = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    periods.push({
      period: formatDate(new Date(currentDate), period),
      volume: 0
    });

    switch (period) {
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "quarterly":
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
  }
  return periods;
};

export function LNGBarChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [data, setData] = useState<any[]>([]);

  const years = useMemo(() => {
    const yearList = Array.from({ length: 6 }, (_, i) => (2019 + i).toString());
    return ["all", ...yearList];
  }, []);

  // Calculate average based on period
  const averageValue = useMemo(() => {
    if (!data.length) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.volume, 0);
    return sum / data.length;
  }, [data]);

  // Add average to each data point
  const dataWithAverage = useMemo(() => {
    return data.map(item => ({
      ...item,
      average: averageValue
    }));
  }, [data, averageValue]);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = new Date('2019-01-01');
      const endDate = new Date('2024-12-31');

      if (selectedPeriod === "quarterly") {
        startDate.setMonth(0);
      }
      if (selectedPeriod === "yearly") {
        startDate.setMonth(0);
        startDate.setDate(1);
      }

      const { data: response, error } = await supabase
        .from('LNG Information')
        .select('date, import_Volume')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const emptyPeriods = generateEmptyPeriods(startDate, endDate, selectedPeriod);

      const processedData = response.reduce((acc: any[], curr: any) => {
        if (!curr.date) return acc;
        
        const date = new Date(curr.date);
        const period = formatDate(date, selectedPeriod);
        const year = date.getFullYear().toString();
        
        const existingEntry = acc.find(item => item.period === period);
        if (existingEntry) {
          existingEntry.volume += Number(curr.import_Volume || 0);
          existingEntry.year = year;
        } else {
          const emptyPeriodIndex = emptyPeriods.findIndex(ep => ep.period === period);
          if (emptyPeriodIndex !== -1) {
            emptyPeriods[emptyPeriodIndex].volume = Number(curr.import_Volume || 0);
            emptyPeriods[emptyPeriodIndex].year = year;
          }
        }
        return acc;
      }, emptyPeriods);

      setData(processedData);
    };

    fetchData();
  }, [selectedPeriod]);

  const { trendColor } = useMemo(() => {
    if (data.length < 2) return { trendColor: "#4ADE80" };
    const startValue = data[0].volume;
    const endValue = data[data.length - 1].volume;
    return {
      trendColor: endValue >= startValue ? "#4ADE80" : "#ef4444",
    };
  }, [data]);

  const showYearFilter = selectedPeriod !== "yearly";

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] transition-all hover:ring-1 hover:ring-dashboard-blue/20 overflow-hidden">
      <div className="flex flex-col items-center pt-6">
        <CardTitle className="text-xl font-semibold mb-4 text-center">
          LNG Import Volume
        </CardTitle>
        <div className="flex gap-4 mb-4">
          <Select
            value={selectedPeriod}
            onValueChange={(value: Period) => setSelectedPeriod(value)}
          >
            <SelectTrigger className="w-[180px] hover:bg-dashboard-navy/80">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {showYearFilter && (
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[120px] hover:bg-dashboard-navy/80">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.filter(year => year !== "all").map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={dataWithAverage}
            margin={{ top: 5, right: 30, left: 60, bottom: 45 }}
          >
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
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [
                name === "Average" 
                  ? `${value.toLocaleString()} MMBtu (Avg)`
                  : `${value.toLocaleString()} MMBtu`,
                name
              ]}
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
              dataKey="volume"
              name="Import Volume"
              fill={trendColor}
              radius={[4, 4, 0, 0]}
              style={{ cursor: "pointer" }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fillOpacity={
                    selectedYear === "all" || !showYearFilter || entry.year === selectedYear
                      ? 1
                      : 0.3
                  }
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="average"
              stroke="#FFB86C"
              strokeWidth={3}
              dot={false}
              name="Average"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
