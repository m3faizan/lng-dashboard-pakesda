import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

type CargoData = {
  month: string;
  longTerm: number;
  spot: number;
};

export function CargoTypesChart() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [yearlyData, setYearlyData] = useState<{ [key: string]: CargoData[] }>({});
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["longTerm", "spot"]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('LNG Information')
        .select('date, num_Long_Term_Cargoes, num_Spot_Cargoes')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const processedData: { [key: string]: CargoData[] } = {};
      const years = new Set<string>();

      data.forEach((record) => {
        if (!record.date) return;
        
        const date = new Date(record.date);
        const year = date.getFullYear().toString();
        const month = date.toLocaleString('default', { month: 'short' });
        
        years.add(year);

        if (!processedData[year]) {
          processedData[year] = [];
        }

        const existingMonth = processedData[year].find(m => m.month === month);
        if (existingMonth) {
          existingMonth.longTerm = (existingMonth.longTerm || 0) + (record.num_Long_Term_Cargoes || 0);
          existingMonth.spot = (existingMonth.spot || 0) + (record.num_Spot_Cargoes || 0);
        } else {
          processedData[year].push({
            month,
            longTerm: record.num_Long_Term_Cargoes || 0,
            spot: record.num_Spot_Cargoes || 0,
          });
        }
      });

      const sortedYears = Array.from(years).sort((a, b) => b.localeCompare(a));
      setAvailableYears(sortedYears);
      setYearlyData(processedData);
      
      if (sortedYears.length > 0 && !selectedYear) {
        setSelectedYear(sortedYears[0]);
      }
    };

    fetchData();
  }, []);

  const toggleCargoType = (type: string) => {
    setSelectedTypes(prev => {
      const newSelection = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      // Ensure at least one type remains selected
      return newSelection.length > 0 ? newSelection : [type];
    });
  };

  if (!selectedYear || !yearlyData[selectedYear]) {
    return (
      <Card className="bg-dashboard-navy border-0 h-[480px] w-full transition-all hover:ring-1 hover:ring-dashboard-blue/20">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Loading data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] w-full transition-all hover:ring-1 hover:ring-dashboard-blue/20 overflow-hidden">
      <div className="flex flex-col items-center pt-6">
        <CardTitle className="text-xl font-semibold mb-4 text-center">
          Cargo Types Distribution
        </CardTitle>
        <Select
          value={selectedYear}
          onValueChange={(value) => setSelectedYear(value)}
        >
          <SelectTrigger className="w-[180px] mb-4 hover:bg-dashboard-navy/80">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <CardContent className="h-[400px] px-4">
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={yearlyData[selectedYear]}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} />
            <XAxis 
              type="number"
              tick={{ fill: "#94a3b8" }}
              height={50}
            />
            <YAxis
              type="category"
              dataKey="month"
              tick={{ fill: "#94a3b8" }}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "1px solid #2D3748",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              formatter={(value: number, name: string) => [
                value,
                name === "longTerm" ? "Long Term" : "Spot"
              ]}
            />
            {selectedTypes.includes("longTerm") && (
              <Bar
                dataKey="longTerm"
                name="Long Term"
                fill="#0EA5E9"
                radius={[0, 4, 4, 0]}
                stackId="a"
              />
            )}
            {selectedTypes.includes("spot") && (
              <Bar
                dataKey="spot"
                name="Spot"
                fill="#FEC6A1"
                radius={[0, 4, 4, 0]}
                stackId="a"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4 mb-6">
          <button
            onClick={() => toggleCargoType("longTerm")}
            className={`flex items-center gap-2 px-3 py-1 rounded-md transition-opacity ${
              selectedTypes.includes("longTerm") ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="w-3 h-3 bg-dashboard-blue rounded-sm"></div>
            <span className="text-sm text-gray-400">Long Term</span>
          </button>
          <button
            onClick={() => toggleCargoType("spot")}
            className={`flex items-center gap-2 px-3 py-1 rounded-md transition-opacity ${
              selectedTypes.includes("spot") ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="w-3 h-3 bg-dashboard-coral rounded-sm"></div>
            <span className="text-sm text-gray-400">Spot</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
