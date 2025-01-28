import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { PeriodSelector } from "./chart/PeriodSelector";
import { LNGVolumeChart } from "./chart/LNGVolumeChart";
import { formatDate, generateEmptyPeriods, calculateAverage } from "@/utils/chartUtils";

type Period = "monthly" | "quarterly" | "yearly";

export function LNGBarChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [data, setData] = useState<any[]>([]);

  const years = useMemo(() => {
    const yearList = Array.from({ length: 6 }, (_, i) => (2019 + i).toString());
    return ["all", ...yearList];
  }, []);

  const averageValue = useMemo(() => calculateAverage(data), [data]);

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
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          selectedYear={selectedYear}
          onPeriodChange={setSelectedPeriod}
          onYearChange={setSelectedYear}
          showYearFilter={showYearFilter}
          years={years}
        />
      </div>
      <CardContent className="h-[400px]">
        <LNGVolumeChart
          data={dataWithAverage}
          selectedYear={selectedYear}
          showYearFilter={showYearFilter}
          trendColor={trendColor}
        />
      </CardContent>
    </Card>
  );
}