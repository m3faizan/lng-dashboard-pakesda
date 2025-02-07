
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
} from "recharts";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TimeFrameSelector } from "@/components/charts/TimeFrameSelector";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";

interface PowerGenChartProps {
  dataKey: "powerGeneration" | "powerGenCost" | "rlngShare";
  color: string;
  valueFormatter: (value: number) => string;
  label: string;
  className?: string;
}

interface PowerGenData {
  date: string;
  powerGeneration: number | null;
  powerGenCost: number | null;
  rlngShare: number | null;
}

export function PowerGenChart({ dataKey, color, valueFormatter, label, className }: PowerGenChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPercentage, setShowPercentage] = useState(false);
  const [showAverage, setShowAverage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, get the latest date from the data
        const { data: latestData, error: latestError } = await supabase
          .from('LNG Power Gen')
          .select(`date,${dataKey}`)
          .order('date', { ascending: false })
          .limit(1);

        if (latestError) throw latestError;
        if (!latestData || latestData.length === 0) {
          setError('No data available');
          return;
        }

        const latestDate = new Date(latestData[0].date);
        const startDate = new Date(latestDate);

        // Calculate start date based on selected timeframe
        if (selectedTimeframe === new Date().getMonth()) {
          // YTD: From January 1st of current year
          startDate.setFullYear(new Date().getFullYear(), 0, 1);
        } else {
          // For all other timeframes, calculate from the last day of the latest month
          startDate.setDate(1); // Go to first day of the month
          startDate.setMonth(startDate.getMonth() - selectedTimeframe + 1); // +1 to include current month
        }

        // Fetch data for the selected time range
        const { data: powerGenData, error: fetchError } = await supabase
          .from('LNG Power Gen')
          .select(`date,${dataKey}`)
          .gte('date', startDate.toISOString())
          .lte('date', latestDate.toISOString())
          .order('date', { ascending: true });

        if (fetchError) throw fetchError;

        if (!powerGenData) {
          setError('No data available');
          return;
        }

        const transformedData = powerGenData
          .filter((item): item is PowerGenData => {
            return item !== null && typeof item.date === 'string';
          })
          .map((item, index, array) => {
            const currentValue = Number(item[dataKey]) || 0;
            let percentageChange = 0;
            
            if (index > 0) {
              const previousValue = Number(array[index - 1][dataKey]) || 0;
              percentageChange = previousValue !== 0 
                ? ((currentValue - previousValue) / previousValue) * 100 
                : 0;
            }

            // Calculate moving average (3-month window)
            let movingAverage = currentValue;
            if (index >= 2) {
              const sum = array
                .slice(Math.max(0, index - 2), index + 1)
                .reduce((acc, curr) => acc + (Number(curr[dataKey]) || 0), 0);
              movingAverage = sum / 3;
            }

            return {
              month: new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
              date: new Date(item.date),
              value: currentValue,
              percentageChange: percentageChange,
              movingAverage: movingAverage
            };
          })
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        setData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('An unexpected error occurred');
      }
    };

    fetchData();
  }, [selectedTimeframe, dataKey]);

  if (error) {
    return (
      <div className="space-y-6">
        <TimeFrameSelector 
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          color={color}
        />
        <div className="h-[320px] flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  const getDisplayValue = (dataPoint: any) => {
    return showPercentage ? dataPoint.percentageChange : dataPoint.value;
  };

  const getValueFormatter = (value: number) => {
    if (showPercentage) {
      return `${value.toFixed(2)}%`;
    }
    return valueFormatter(value);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between items-center">
        <TimeFrameSelector 
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          color={color}
        />
        <div className="flex gap-2">
          <Toggle
            pressed={showPercentage}
            onPressedChange={setShowPercentage}
            className="px-4 py-2 text-sm font-medium bg-transparent hover:bg-gray-700/50 data-[state=on]:bg-gray-700"
          >
            %
          </Toggle>
          <Toggle
            pressed={showAverage}
            onPressedChange={setShowAverage}
            className="px-4 py-2 text-sm font-medium bg-transparent hover:bg-gray-700/50 data-[state=on]:bg-gray-700"
          >
            Avg.
          </Toggle>
        </div>
      </div>
      
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => showPercentage ? `${value.toFixed(1)}%` : value.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1E2D",
                border: "none",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                getValueFormatter(value), 
                showPercentage ? "Change" : label
              ]}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey={showPercentage ? "percentageChange" : "value"}
              stroke={color}
              fillOpacity={1}
              fill={`url(#color${dataKey})`}
            />
            {showAverage && (
              <Line
                type="monotone"
                dataKey="movingAverage"
                stroke={color}
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={2}
                name="Moving Average"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
