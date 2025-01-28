import {
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  period: string;
  volume: number;
  average: number;
  year?: string;
}

interface LNGVolumeChartProps {
  data: ChartData[];
  selectedYear: string;
  showYearFilter: boolean;
  trendColor: string;
}

export function LNGVolumeChart({
  data,
  selectedYear,
  showYearFilter,
  trendColor,
}: LNGVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={data}
        margin={{ top: 5, right: 30, left: 60, bottom: 45 }}
      >
        <XAxis
          dataKey="period"
          stroke="#525252"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#525252"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1A1E2D",
            border: "none",
            borderRadius: "8px",
          }}
          formatter={(value: number, name: string) => [
            name === "Moving Average" 
              ? `${(value / 1000000).toFixed(2)}M MMBtu (MA)`
              : `${(value / 1000000).toFixed(2)}M MMBtu`,
            name
          ]}
        />
        <Legend 
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{
            paddingTop: "12px",
            fontSize: "12px",
            display: "flex",
            justifyContent: "center",
            gap: "1rem"
          }}
        />
        <Bar
          dataKey="volume"
          name="Import Volume"
          fill={trendColor}
          radius={[4, 4, 0, 0]}
          style={{ cursor: "pointer" }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fillOpacity={
                selectedYear === "all" || !showYearFilter || entry.year === selectedYear
                  ? 1
                  : 0.3
              }
            />
          ))}
        </Bar>
        <Line
          type="monotone"
          dataKey="average"
          stroke="#4fd1c5"
          strokeWidth={3}
          dot={false}
          name="Moving Average"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}