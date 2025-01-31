import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ChartTooltip } from "../charts/shared/ChartTooltip";
import { useState } from "react";

interface LNGVolumeChartProps {
  data: any[];
  selectedYear: string;
  showYearFilter: boolean;
  trendColor: string;
  unit?: string;
}

export function LNGVolumeChart({ 
  data, 
  selectedYear, 
  showYearFilter,
  trendColor,
  unit = ""
}: LNGVolumeChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const handleLegendClick = (entry: { value: string; dataKey: string }) => {
    setHiddenSeries(prev => 
      prev.includes(entry.dataKey) 
        ? prev.filter(key => key !== entry.dataKey)
        : [...prev, entry.dataKey]
    );
  };

  const filteredData = showYearFilter && selectedYear !== "all"
    ? data.map(item => ({
        ...item,
        volume: item.year === selectedYear ? item.volume : item.volume * 0.3,
        average: item.year === selectedYear ? item.average : item.average * 0.3
      }))
    : data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={filteredData}>
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="period"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#525252', fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#525252', fontSize: 12 }}
          tickFormatter={(value) => `${value}${unit}`}
        />
        <Tooltip
          content={({ active, payload }) => (
            <ChartTooltip
              active={active}
              payload={payload}
              valueFormatter={(value) => `${value.toFixed(2)}${unit}`}
            />
          )}
        />
        <Legend 
          onClick={handleLegendClick}
          formatter={(value, entry) => {
            const isHidden = entry.dataKey && hiddenSeries.includes(entry.dataKey.toString());
            return (
              <span style={{ color: isHidden ? '#999' : '#fff' }}>
                {value === "volume" ? "Import Payments" : "Moving Average"}
              </span>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="volume"
          name="Import Payments"
          stroke="#4ADE80"
          fill="url(#colorVolume)"
          strokeWidth={2}
          opacity={hiddenSeries.includes("volume") ? 0.3 : 1}
        />
        <Area
          type="monotone"
          dataKey="average"
          name="Moving Average"
          stroke={trendColor}
          fill="none"
          strokeWidth={2}
          strokeDasharray="5 5"
          opacity={hiddenSeries.includes("average") ? 0.3 : 1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}