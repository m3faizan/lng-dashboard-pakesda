import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
type ChartData = {
  period: string;
  value: number;
};
export function LNGBarChart() {
  const [showDESSlope, setShowDESSlope] = useState(false);
  const [data, setData] = useState<ChartData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fetchData = async () => {
      // First, get the most recent date
      const {
        data: latestData
      } = await supabase.from('LNG Port_Price_Import').select('date').order('date', {
        ascending: false
      }).limit(1);
      if (!latestData || latestData.length === 0) return;
      const latestDate = new Date(latestData[0].date);
      const startDate = new Date(latestDate);

      // For YTD, use current year's start
      if (selectedTimeframe === new Date().getMonth()) {
        startDate.setFullYear(new Date().getFullYear(), 0, 1); // January 1st of current year
      } else {
        // For other timeframes, go back X-1 months from latest date
        // We subtract 1 from the selectedTimeframe because we want the current month plus X-1 previous months
        startDate.setMonth(latestDate.getMonth() - (selectedTimeframe - 1));
        startDate.setDate(1);
      }
      startDate.setHours(0, 0, 0, 0);
      const {
        data: response,
        error
      } = await supabase.from('LNG Port_Price_Import').select('date, wAvg_DES, DES_Slope').gte('date', startDate.toISOString()).lte('date', latestDate.toISOString()).order('date', {
        ascending: true
      });
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      // Process data points but reduce frequency for mobile
      let processedData = response.map(item => {
        const date = new Date(item.date);
        const value = showDESSlope ? Number(item.DES_Slope) : Number(item.wAvg_DES);
        return {
          period: date.toLocaleString('default', {
            month: 'short',
            year: '2-digit'
          }),
          value,
          monthIndex: date.getMonth(),
          fullDate: date
        };
      });

      // For mobile view, reduce data points based on timeframe
      if (isMobile) {
        if (selectedTimeframe > 12) {
          // For longer timeframes (1Y+), show quarterly data
          processedData = processedData.filter((item, index, array) => {
            const quarter = Math.floor(item.monthIndex / 3);
            const previousItem = index > 0 ? array[index - 1] : null;
            const previousQuarter = previousItem ? Math.floor(previousItem.monthIndex / 3) : -1;

            // Keep if first item, last item, or first of a new quarter
            return index === 0 || index === array.length - 1 || quarter !== previousQuarter;
          });
        } else if (selectedTimeframe > 6) {
          // For medium timeframes (6M-12M), show bi-monthly data
          processedData = processedData.filter((item, index, array) => index === 0 || index === array.length - 1 || item.monthIndex % 2 === 0);
        }
        // For shorter timeframes (≤6M), keep more data points but still filter some
        else if (processedData.length > 8) {
          processedData = processedData.filter((_, index, array) => index === 0 || index === array.length - 1 || index % 2 === 0);
        }
      }

      // Sort by date and format final data
      const finalData = processedData.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime()).map(({
        period,
        value
      }) => ({
        period,
        value
      }));
      setData(finalData);
    };
    fetchData();
  }, [showDESSlope, selectedTimeframe, isMobile]);

  // Calculate appropriate min/max y-axis values with 10% padding
  const getYAxisDomain = () => {
    if (data.length === 0) return [0, 10];
    const values = data.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  };
  const getYAxisLabel = () => {
    return showDESSlope ? "%" : "$/MMBtu";
  };
  const formatValue = (value: number) => {
    return showDESSlope ? `${value.toFixed(2)}%` : `$${value.toFixed(2)}`;
  };
  const timeframes = [{
    label: "3M",
    months: 3
  }, {
    label: "6M",
    months: 6
  }, {
    label: "YTD",
    months: new Date().getMonth()
  }, {
    label: "1Y",
    months: 12
  }, {
    label: "5Y",
    months: 60
  }, {
    label: "Max",
    months: 120
  }];

  // Mobile-specific margins with sufficient left padding for y-axis
  const chartMargin = isMobile ? {
    top: 10,
    right: 10,
    left: 24,
    bottom: 45
  } : {
    top: 20,
    right: 30,
    left: 60,
    bottom: 20
  };
  return <Card className="bg-dashboard-navy border-0 min-h-[330px] md:h-[480px] w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg">
      <div className="flex flex-col items-center pt-3 md:pt-6">
        <CardTitle className="text-lg md:text-xl font-semibold text-center mb-1 md:mb-4">
          LNG Price
        </CardTitle>
        <Select value={showDESSlope ? "slope" : "price"} onValueChange={value => setShowDESSlope(value === "slope")}>
          <SelectTrigger className="w-[90%] md:w-[180px] h-10 rounded-full mb-2 md:mb-4 hover:bg-dashboard-navy/80 text-sm">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">DES Price</SelectItem>
            <SelectItem value="slope">DES Slope</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Adjusted for mobile: Reduced chart height, ensured timeframe selector is visible */}
      <CardContent className="flex flex-col px-2 md:px-4">
        <div className="h-[170px] md:h-[330px] mb-2 md:mb-4">
          <ResponsiveContainer width="100%" height="100%" className="my-2">
            <LineChart data={data} margin={chartMargin} onClick={isMobile ? data => console.log("Chart clicked:", data) : undefined}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={45} interval={isMobile ? "preserveStartEnd" : 0} minTickGap={15} tick={{
              letterSpacing: isMobile ? -0.5 : 0,
              transform: isMobile ? "rotate(-45)" : undefined,
              transformOrigin: "top right"
            }} />
              <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} width={isMobile ? 24 : 60} tickCount={4} domain={getYAxisDomain()} label={{
              value: getYAxisLabel(),
              angle: -90,
              position: 'insideLeft',
              style: {
                fill: '#94a3b8',
                fontSize: 11
              },
              offset: 5
            }} />
              <Tooltip position={{
              y: -50
            }} contentStyle={{
              backgroundColor: "#1A1E2D",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              padding: "8px 12px",
              touchAction: "none"
            }} wrapperStyle={{
              zIndex: 1000,
              pointerEvents: "none"
            }} formatter={(value: number) => [formatValue(value)]} cursor={{
              strokeWidth: 2
            }} />
              <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2} dot={isMobile ? {
              r: 3,
              strokeWidth: 1
            } : false} activeDot={{
              r: 6,
              strokeWidth: 2
            }} isAnimationActive={!isMobile} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Time selector positioned with adequate spacing */}
        <div className="flex flex-wrap justify-center gap-2 mt-1 md:mt-4 mb-3 md:mb-4 mx-[30px]">
          {timeframes.map(tf => <button key={tf.label} onClick={() => setSelectedTimeframe(tf.months)} className={`min-w-[40px] px-3 py-2 rounded-md text-xs md:text-sm ${selectedTimeframe === tf.months ? "bg-dashboard-blue text-white" : "bg-dashboard-dark/50 text-muted-foreground hover:bg-dashboard-dark"}`}>
              {tf.label}
            </button>)}
        </div>
      </CardContent>

      <style jsx global>{`
        @media (max-width: 480px) {
          .chart-container {
            margin: 0;
            padding: 12px 8px;
          }
        }
      `}</style>
    </Card>;
}