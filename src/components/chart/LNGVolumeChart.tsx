import { Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";

interface DataPoint {
  period: string;
  volume: number;
  average: number;
  year: string;
}

interface LNGVolumeChartProps {
  data: DataPoint[];
  selectedYear: string;
  showYearFilter: boolean;
  trendColor: string;
  unit: string;
}

export function LNGVolumeChart({ data, selectedYear, showYearFilter, trendColor, unit }: LNGVolumeChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const handleLegendClick = (dataKey: string | number | ((obj: any) => any)) => {
    const key = typeof dataKey === 'function' ? 'unknown' : String(dataKey);
    setHiddenSeries(prev => 
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const isSeriesVisible = (key: string) => !hiddenSeries.includes(key);
  const getOpacity = (year: string) => {
    if (!showYearFilter || selectedYear === 'all') return 1;
    return year === selectedYear ? 1 : 0.3;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <XAxis 
          dataKey="period" 
          tick={{ fill: 'white' }}
          axisLine={{ stroke: '#666' }}
        />
        <YAxis 
          tick={{ fill: 'white' }}
          axisLine={{ stroke: '#666' }}
          label={{ 
            value: `${unit}`, 
            angle: -90, 
            position: 'insideLeft', 
            fill: 'white',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1b1e', 
            border: '1px solid #2d2e33',
            borderRadius: '6px'
          }}
          labelStyle={{ color: 'white' }}
          itemStyle={{ color: 'white' }}
        />
        <Bar
          dataKey="volume"
          name="LNG Payments"
          fill={trendColor}
          opacity={isSeriesVisible('volume') ? 1 : 0.3}
          onClick={() => handleLegendClick('volume')}
          style={{ cursor: 'pointer' }}
        >
          {data.map((entry, index) => (
            <Bar
              key={`bar-${index}`}
              dataKey="volume"
              fill={trendColor}
              opacity={getOpacity(entry.year)}
            />
          ))}
        </Bar>
        <Line
          type="monotone"
          dataKey="average"
          name="Moving Average"
          stroke="#4ADE80"
          strokeWidth={2}
          dot={false}
          opacity={isSeriesVisible('average') ? 1 : 0.3}
          onClick={() => handleLegendClick('average')}
          style={{ cursor: 'pointer' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}