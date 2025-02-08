
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChartTooltip } from "./charts/shared/ChartTooltip";

type Period = "monthly" | "quarterly" | "yearly";
type SeriesVisibility = {
  EETL: boolean;
  PGPCL: boolean;
};

interface CargoData {
  date: string;
  EETL_cargo: number | null;
  PGPCL_cargo: number | null;
}

export function CargoActivityChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");
  const [data, setData] = useState<any[]>([]);
  const [seriesVisibility, setSeriesVisibility] = useState<SeriesVisibility>({
    EETL: true,
    PGPCL: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use fixed date range from Jan 2019 to Dec 2024
        const startDate = new Date('2019-01-01');
        const endDate = new Date('2024-12-31');

        const { data: cargoData, error: fetchError } = await supabase
          .from('LNG Information')
          .select('date,EETL_cargo,PGPCL_cargo')
          .gte('date', startDate.toISOString())
          .lte('date', endDate.toISOString())
          .order('date', { ascending: true });

        if (fetchError) throw fetchError;
        if (!cargoData) return;

        // Create a map to aggregate data by period
        const aggregatedData = new Map();

        cargoData.forEach((item: CargoData) => {
          if (!item || !item.date) return;
          
          const date = new Date(item.date);
          let periodKey;
          
          if (selectedPeriod === "monthly") {
            periodKey = date.toLocaleString('default', { month: 'short', year: '2-digit' });
          } else if (selectedPeriod === "quarterly") {
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            periodKey = `Q${quarter} '${date.getFullYear().toString().slice(-2)}`;
          } else {
            periodKey = date.getFullYear().toString();
          }

          if (!aggregatedData.has(periodKey)) {
            aggregatedData.set(periodKey, {
              period: periodKey,
              EETL: 0,
              PGPCL: 0,
              count: 0
            });
          }

          const current = aggregatedData.get(periodKey);
          current.EETL += Number(item.EETL_cargo) || 0;
          current.PGPCL += Number(item.PGPCL_cargo) || 0;
          current.count += 1;
        });

        // Convert aggregated data to final format
        const transformedData = Array.from(aggregatedData.values()).map(item => {
          // For monthly and quarterly, we want the average
          if (selectedPeriod !== "yearly") {
            return {
              period: item.period,
              EETL: Math.round(item.EETL / item.count),
              PGPCL: Math.round(item.PGPCL / item.count)
            };
          }
          // For yearly, we want the total
          return {
            period: item.period,
            EETL: Math.round(item.EETL),
            PGPCL: Math.round(item.PGPCL)
          };
        });

        // Sort the data chronologically
        transformedData.sort((a, b) => {
          if (selectedPeriod === "monthly") {
            const [aMonth, aYear] = a.period.split(" ");
            const [bMonth, bYear] = b.period.split(" ");
            if (aYear !== bYear) return aYear.localeCompare(bYear);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return months.indexOf(aMonth) - months.indexOf(bMonth);
          } else if (selectedPeriod === "quarterly") {
            const aQuarter = parseInt(a.period.split(" ")[0].substring(1));
            const aYear = a.period.split(" ")[1];
            const bQuarter = parseInt(b.period.split(" ")[0].substring(1));
            const bYear = b.period.split(" ")[1];
            if (aYear !== bYear) return aYear.localeCompare(bYear);
            return aQuarter - bQuarter;
          }
          return a.period.localeCompare(b.period);
        });

        setData(transformedData);
      } catch (err) {
        console.error('Error fetching cargo data:', err);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const handleLegendClick = (dataKey: string) => {
    setSeriesVisibility(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey as keyof SeriesVisibility],
    }));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
  
    return (
      <div className="bg-[#1A1E2D] border border-gray-700 rounded-lg p-3 text-sm shadow-lg">
        <div className="text-gray-400 mb-1">{payload[0].payload.period}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="whitespace-nowrap text-white">
            <span>{entry.name}: </span>
            <span className="font-mono font-medium">
              {Math.round(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg overflow-hidden">
      <div className="flex flex-col items-center pt-6 pb-2">
        <CardTitle className="text-lg font-semibold mb-4">Cargo Activity by Terminal</CardTitle>
        <Select
          value={selectedPeriod}
          onValueChange={(value: Period) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-[180px] mb-4">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <CardContent className="h-[400px] px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                paddingTop: "12px",
                fontSize: "12px",
              }}
              onClick={(e) => {
                if (typeof e.dataKey === 'string') {
                  handleLegendClick(e.dataKey);
                }
              }}
            />
            <Bar
              dataKey="EETL"
              stackId="a"
              fill="#4ADE80"
              name="EETL Terminal"
              opacity={seriesVisibility.EETL ? 1 : 0.3}
            />
            <Bar
              dataKey="PGPCL"
              stackId="a"
              fill="#0EA5E9"
              name="PGPCL Terminal"
              opacity={seriesVisibility.PGPCL ? 1 : 0.3}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
