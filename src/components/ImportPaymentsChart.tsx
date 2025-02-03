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

type Period = "monthly" | "quarterly" | "yearly";

export function ImportPaymentsChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");
  const [data, setData] = useState<any[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: powerGenData, error } = await supabase
        .from("LNG Power Gen")
        .select("date, importPayment, brentAvg")
        .order("date");

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
              year: "2-digit",
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

        const existingPeriod = acc.find((item) => item.period === period);
        if (existingPeriod) {
          existingPeriod.importPayment =
            (existingPeriod.importPayment + (curr.importPayment || 0)) / 2;
          existingPeriod.brentAvg =
            (existingPeriod.brentAvg + (curr.brentAvg || 0)) / 2;
        } else {
          acc.push({
            period,
            importPayment: curr.importPayment || 0,
            brentAvg: curr.brentAvg || 0,
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
    setHiddenSeries((prev) =>
      prev.includes(seriesName)
        ? prev.filter((name) => name !== seriesName)
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

  return (
    <Card className="bg-dashboard-navy border-0 h-[480px] w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg overflow-hidden">
      <div className="flex flex-col items-center pt-6">
        <CardTitle className="text-xl font-semibold mb-4">
          LNG Import Payments
        </CardTitle>
        <Select value={selectedPeriod} onValueChange={(value: Period) => setSelectedPeriod(value)}>
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
      <CardContent className="h-[400px] px-4">
        <ResponsiveContainer width="100%" height="75%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="period"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              height={50}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={formatImportPayment}
              width={60}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={formatTooltipValue}
            />
            <Legend 
              onClick={handleLegendClick}
              wrapperStyle={{ paddingTop: "2rem" }}
            />
            <Bar
              yAxisId="left"
              dataKey="importPayment"
              name="Import Payments"
              fill="#4ADE80"
              hide={hiddenSeries.includes("importPayment")}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="brentAvg"
              name="Avg. Brent Price"
              stroke="#FEF7CD"
              strokeWidth={3}
              dot={false}
              hide={hiddenSeries.includes("brentAvg")}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}