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

export function LNGBarChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentDate = new Date();
      let query = supabase
        .from('LNG Information')
        .select('date, import_Volume')
        .order('date', { ascending: true });

      // Calculate the start date based on the selected period
      const startDate = new Date();
      switch (selectedPeriod) {
        case "monthly":
          startDate.setMonth(currentDate.getMonth() - 11);
          break;
        case "quarterly":
          startDate.setMonth(currentDate.getMonth() - 12);
          break;
        case "yearly":
          startDate.setFullYear(currentDate.getFullYear() - 4);
          break;
      }

      // Add date filter
      query = query.gte('date', startDate.toISOString());

      const { data: response, error } = await query;

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      // Process the data based on the selected period
      const processedData = response.reduce((acc: any[], curr: any) => {
        const date = new Date(curr.date);
        const period = formatDate(date, selectedPeriod);
        
        const existingEntry = acc.find(item => item.period === period);
        if (existingEntry) {
          existingEntry.volume += Number(curr.import_Volume || 0);
        } else {
          acc.push({
            period,
            volume: Number(curr.import_Volume || 0)
          });
        }
        return acc;
      }, []);

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