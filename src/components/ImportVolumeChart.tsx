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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
        let chartData = Object.values(transformedData).sort(
          (a: any, b: any) => a.fullDate - b.fullDate
        );
        
        // For mobile, reduce data points
        if (isMobile) {
          // Keep every other month or at least one per quarter
          chartData = chartData.filter((_: any, index: number) => 
            index % 2 === 0 || index === chartData.length - 1
          );
        }

        // Get unique years from data
        const uniqueYears = Array.from(
          new Set(importData.map((item) => new Date(item.date).getFullYear().toString()))
        ).sort();

        setYears(uniqueYears);
        // For mobile, limit initial selected years to last 2-3 years for better clarity
        if (isMobile && uniqueYears.length > 2) {
          setSelectedYears(uniqueYears.slice(-2));
        } else {
          setSelectedYears(uniqueYears);
        }
        setData(chartData);
      } catch (error) {
        console.error('Error processing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isMobile]);

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
      <Card className="bg-dashboard-navy border-0 h-[350px]">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-semibold">Import Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center">
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
    <Card className="bg-dashboard-navy border-0 h-[350px]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold">Import Volume</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <div className="mb-2 flex flex-wrap justify-center gap-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => toggleYear(year)}
              className={`px-2 py-1 text-xs rounded-md ${
                selectedYears.includes(year)
                  ? `bg-[${yearColors[year]}]`
                  : 'bg-gray-700 text-gray-400'
              }`}
              style={{ 
                backgroundColor: selectedYears.includes(year) ? yearColors[year] : '',
                color: selectedYears.includes(year) ? 'black' : ''
              }}
            >
              {year}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={isMobile ? 9 : 12}
              tickLine={false}
              axisLine={false}
              interval={isMobile ? 1 : 0}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              fontSize={isMobile ? 9 : 12}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            {years.map((year) => (
              <Line
                key={year}
                type="linear"
                dataKey={year}
                name={year}
                stroke={yearColors[year]}
                strokeWidth={year === new Date().getFullYear().toString() ? 3 : 2}
                dot={false}
                opacity={selectedYears.includes(year) ? 1 : 0.2}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
