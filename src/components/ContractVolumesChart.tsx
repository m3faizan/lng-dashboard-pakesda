import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
const formatYAxis = (value: number) => {
  return `${(value / 1000000).toFixed(1)}M`;
};
const formatTooltipValue = (value: number) => {
  return `${value.toLocaleString()} MMBtu`;
};
export function ContractVolumesChart() {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const {
    data: chartData = [],
    isLoading
  } = useQuery({
    queryKey: ["lng-information"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("LNG Information").select("date, LT_Volume, Spot_Volume, import_Volume").order("date");
      if (error) throw error;
      return data.map(item => ({
        date: new Date(item.date as string).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        }),
        "Long Term": item.LT_Volume,
        Spot: item.Spot_Volume,
        Total: item.import_Volume
      }));
    }
  });
  const handleLegendClick = (seriesName: string) => {
    setHiddenSeries(hiddenSeries.includes(seriesName) ? hiddenSeries.filter(name => name !== seriesName) : [...hiddenSeries, seriesName]);
  };
  if (isLoading) {
    return <Card className="bg-dashboard-navy border-0 h-[400px]">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-semibold">Loading...</CardTitle>
        </CardHeader>
      </Card>;
  }

  // Create a custom legend component
  const CustomLegend = () => {
    const items = [{
      name: "Long Term",
      color: "#4ADE80"
    }, {
      name: "Spot",
      color: "#0EA5E9"
    }, {
      name: "Total",
      color: "#FEF7CD"
    }];
    return <div className="flex justify-center items-center gap-4 mt-1 mb-2 mx-[30px]">
        {items.map(item => <div key={item.name} className="flex items-center cursor-pointer" onClick={() => handleLegendClick(item.name)}>
            <div className="w-3 h-3 mr-2 rounded-sm" style={{
          backgroundColor: item.color,
          opacity: hiddenSeries.includes(item.name) ? 0.5 : 1
        }} />
            <span className={`text-xs ${hiddenSeries.includes(item.name) ? 'text-gray-500' : 'text-gray-300'}`}>
              {item.name}
            </span>
          </div>)}
      </div>;
  };
  return <Card className="bg-dashboard-navy border-0 h-[400px] transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold">Contract Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{
              fill: "#94a3b8"
            }} angle={-45} textAnchor="end" height={60} interval="preserveStartEnd" />
              <YAxis stroke="#94a3b8" tick={{
              fill: "#94a3b8"
            }} tickFormatter={formatYAxis} />
              <Tooltip contentStyle={{
              backgroundColor: "#1A1E2D",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px"
            }} formatter={(value: number, name: string) => [formatTooltipValue(value), name]} />
              <Bar dataKey="Long Term" stackId="a" fill="#4ADE80" hide={hiddenSeries.includes("Long Term")} />
              <Bar dataKey="Spot" stackId="a" fill="#0EA5E9" hide={hiddenSeries.includes("Spot")} />
              <Line type="monotone" dataKey="Total" stroke="#FEF7CD" strokeWidth={3} dot={false} hide={hiddenSeries.includes("Total")} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom legend in a separate div */}
        <CustomLegend />
      </CardContent>
    </Card>;
}