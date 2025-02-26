
import { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

type Period = "monthly" | "quarterly" | "yearly";

export function ImportPaymentsChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");
  const [data, setData] = useState<any[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: powerGenData,
        error
      } = await supabase.from("LNG Power Gen").select("date, importPayment, brentAvg").order("date");
      
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      const processedData = powerGenData.reduce((acc: any[], curr: any) => {
        const date = new Date(curr.date);
        let period;
        switch (selectedPeriod) {
          case "monthly":
            period = date.toLocaleString("default", {
              month: "short",
              year: "2-digit"
            });
            break;
          case "quarterly":
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            period = `Q${quarter} '${date.getFullYear().toString().slice(-2)}`;
            break;
          case "yearly":
            period = date.getFullYear().toString();
            break;
        }
        const existingPeriod = acc.find(item => item.period === period);
        if (existingPeriod) {
          existingPeriod.importPayment = (existingPeriod.importPayment + (curr.importPayment || 0)) / 2;
          existingPeriod.brentAvg = (existingPeriod.brentAvg + (curr.brentAvg || 0)) / 2;
        } else {
          acc.push({
            period,
            importPayment: curr.importPayment || 0,
            brentAvg: curr.brentAvg || 0
          });
        }
        return acc;
      }, []);
      
      setData(processedData);
    };
    
    fetchData();
  }, [selectedPeriod]);

  const handleLegendClick = (e: any) => {
    const seriesName = e.dataKey;
    setHiddenSeries(prev => 
      prev.includes(seriesName) 
        ? prev.filter(name => name !== seriesName) 
        : [...prev, seriesName]
    );
  };

  const formatImportPayment = (value: number) => {
    return `${(value / 1000).toFixed(1)}M`;
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (name === "Import Payments") {
      return [`$${(value / 1000).toFixed(1)}M`, name];
    }
    return [`$${value.toFixed(2)}/bbl`, name];
  };

  const chartMargin = isMobile
    ? { top: 20, right: 30, left: 60, bottom: 140 }
    : { top: 20, right: 30, left: 60, bottom: 80 };

  return (
    <Card className="bg-dashboard-navy border-0 h-[500px] md:h-[480px] w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg">
      <div className="flex flex-col items-center pt-6">
        <CardTitle className="text-lg md:text-xl font-semibold mb-4 text-center px-4">
          LNG Import Payments
        </CardTitle>
        <Select 
          value={selectedPeriod} 
          onValueChange={(value: Period) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-[140px] md:w-[180px] mb-4 bg-dashboard-dark/50 text-white border-gray-700 hover:bg-dashboard-dark/80">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-dashboard-navy border-gray-700">
            <SelectItem value="monthly" className="text-white hover:bg-dashboard-dark/50">Monthly</SelectItem>
            <SelectItem value="quarterly" className="text-white hover:bg-dashboard-dark/50">Quarterly</SelectItem>
            <SelectItem value="yearly" className="text-white hover:bg-dashboard-dark/50">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <CardContent className="flex-1 h-[calc(100%-140px)] min-h-[300px] px-2 md:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={chartMargin}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis
              dataKey="period"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              fontSize={isMobile ? 10 : 11}
              height={90}
              angle={-60}
              textAnchor="end"
              interval={isMobile ? 1 : 0}
              tickMargin={35}
              tickSize={8}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={formatImportPayment}
              width={isMobile ? 60 : 65}
              fontSize={isMobile ? 11 : 12}
              tickMargin={8}
              tickCount={6}
              domain={[0, 'auto']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              width={isMobile ? 55 : 60}
              fontSize={isMobile ? 11 : 12}
              tickMargin={8}
              tickCount={6}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: isMobile ? "13px" : "14px",
                padding: "12px 16px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                color: "#fff"
              }}
              formatter={formatTooltipValue}
              wrapperStyle={{ zIndex: 1000 }}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Legend 
              onClick={handleLegendClick}
              wrapperStyle={{
                paddingTop: "1rem",
                position: "absolute",
                bottom: isMobile ? "-110px" : "-60px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                fontSize: isMobile ? "12px" : "13px",
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem"
              }}
              iconSize={isMobile ? 16 : 14}
              iconType="circle"
            />
            <Bar
              yAxisId="left"
              dataKey="importPayment"
              name="Import Payments"
              fill="#4ADE80"
              hide={hiddenSeries.includes("importPayment")}
              radius={[4, 4, 0, 0]}
              maxBarSize={isMobile ? 40 : 50}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="brentAvg"
              name="Avg. Brent Price"
              stroke="#FEF7CD"
              strokeWidth={isMobile ? 2.5 : 2}
              dot={false}
              hide={hiddenSeries.includes("brentAvg")}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
