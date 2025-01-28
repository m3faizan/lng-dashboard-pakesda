import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
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
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Set fixed date range from 2019 to 2024
      const startDate = new Date('2019-01-01');
      const endDate = new Date('2024-12-31');

      // Set to beginning of period
      if (selectedPeriod === "quarterly") {
        startDate.setMonth(0); // Q1 starts in January
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

      // Generate empty periods for the complete range
      const emptyPeriods = generateEmptyPeriods(startDate, endDate, selectedPeriod);

      // Process the actual data
      const processedData = response.reduce((acc: any[], curr: any) => {
        if (!curr.date) return acc;
        
        const date = new Date(curr.date);
        const period = formatDate(date, selectedPeriod);
        
        const existingEntry = acc.find(item => item.period === period);
        if (existingEntry) {
          existingEntry.volume += Number(curr.import_Volume || 0);
        } else {
          const emptyPeriodIndex = emptyPeriods.findIndex(ep => ep.period === period);
          if (emptyPeriodIndex !== -1) {
            emptyPeriods[emptyPeriodIndex].volume = Number(curr.import_Volume || 0);
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

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] transition-all hover:ring-1 hover:ring-dashboard-blue/20 overflow-hidden">
      <div className="flex flex-col items-center pt-6">
        <CardTitle className="text-xl font-semibold mb-4 text-center">
          LNG Import Volume
        </CardTitle>
        <Select
          value={selectedPeriod}
          onValueChange={(value: Period) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-[180px] mb-4 hover:bg-dashboard-navy/80">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
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
              formatter={(value: number) => [`${value.toLocaleString()} MMBtu`, "Import Volume"]}
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
              onMouseOver={(data, index) => {
                document.querySelectorAll(".recharts-bar-rectangle").forEach((rect: any) => {
                  if (rect.getAttribute("index") === index.toString()) {
                    rect.style.fill = "#66E99D";
                  }
                });
              }}
              onMouseOut={(data, index) => {
                document.querySelectorAll(".recharts-bar-rectangle").forEach((rect: any) => {
                  if (rect.getAttribute("index") === index.toString()) {
                    rect.style.fill = trendColor;
                  }
                });
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}