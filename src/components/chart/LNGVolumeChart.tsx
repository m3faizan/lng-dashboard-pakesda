import { Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
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

  const formatValue = (value: number) => {
    return `${Math.round(value)} M $`;
  };

  // Process data to include opacity
  const processedData = data.map(entry => ({
    ...entry,
    opacity: (!showYearFilter || selectedYear === 'all') ? 1 : (entry.year === selectedYear ? 1 : 0.3)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload) return null;
    
    // Filter to show only volume and average
    const relevantData = payload.filter((entry: any) => 
      entry.dataKey === "volume" || entry.dataKey === "average"
    );
    
    return (
      <div className="bg-[#1a1b1e] border border-[#2d2e33] rounded-lg p-3">
        <p className="text-white mb-1">{payload[0]?.payload.period}</p>
        {relevantData.map((entry: any, index: number) => (
          <p key={index} className="text-white">
            {entry.dataKey === "volume" ? "LNG Payments" : "Moving Average"}: {formatValue(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={processedData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <XAxis 
          dataKey="period" 
          tick={{ fill: 'white' }}
          axisLine={{ stroke: '#666' }}
        />
        <YAxis 
          tick={{ fill: 'white' }}
          axisLine={{ stroke: '#666' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          height={36}
          wrapperStyle={{ color: 'white' }}
        />
        <Bar
          dataKey="volume"
          name="LNG Payments"
          fill="#4ADE80"
          opacity={1}
          fillOpacity="opacity"
          onClick={() => handleLegendClick('volume')}
          style={{ cursor: 'pointer' }}
        />
        <Line
          type="monotone"
          dataKey="average"
          name="Moving Average"
          stroke="white"
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