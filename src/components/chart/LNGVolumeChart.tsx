import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "../charts/shared/ChartTooltip";

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
  const filteredData = showYearFilter && selectedYear !== "all"
    ? data.filter(item => item.year === selectedYear)
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
        <Area
          type="monotone"
          dataKey="volume"
          stroke="#4ADE80"
          fill="url(#colorVolume)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="average"
          stroke={trendColor}
          fill="none"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}