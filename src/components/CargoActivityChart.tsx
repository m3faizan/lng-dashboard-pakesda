
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
        const { data: latestData, error: latestError } = await supabase
          .from('LNG Information')
          .select('date,EETL_cargo,PGPCL_cargo')
          .order('date', { ascending: false })
          .limit(1);

        if (latestError) throw latestError;
        if (!latestData || latestData.length === 0) return;

        const latestDate = new Date(latestData[0].date);
        const startDate = new Date(latestDate);

        // Calculate start date based on selected timeframe
        if (selectedPeriod === "monthly") {
          startDate.setMonth(startDate.getMonth() - 11);
        } else if (selectedPeriod === "quarterly") {
          startDate.setMonth(startDate.getMonth() - 11);
        } else {
          startDate.setFullYear(startDate.getFullYear() - 4);
        }

        const { data: cargoData, error: fetchError } = await supabase
          .from('LNG Information')
          .select('date,EETL_cargo,PGPCL_cargo')
          .gte('date', startDate.toISOString())
          .lte('date', latestDate.toISOString())
          .order('date', { ascending: true });

        if (fetchError) throw fetchError;
        if (!cargoData) return;

        const transformedData = cargoData
          .filter((item): item is CargoData => item !== null && typeof item.date === 'string')
          .map(item => {
            const date = new Date(item.date);
            let period;
            
            if (selectedPeriod === "monthly") {
              period = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            } else if (selectedPeriod === "quarterly") {
              period = `Q${Math.floor(date.getMonth() / 3) + 1} '${date.getFullYear().toString().slice(-2)}`;
            } else {
              period = date.getFullYear().toString();
            }

            return {
              period,
              EETL: Number(item.EETL_cargo) || 0,
              PGPCL: Number(item.PGPCL_cargo) || 0,
            };
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
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                paddingTop: "12px",
                fontSize: "12px",
              }}
              onClick={(e) => handleLegendClick(e.dataKey)}
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
