import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", volume: 400 },
  { month: "Feb", volume: 300 },
  { month: "Mar", volume: 500 },
  { month: "Apr", volume: 450 },
  { month: "May", volume: 470 },
  { month: "Jun", volume: 480 },
];

export function LNGChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4fd1c5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4fd1c5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
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
          tickFormatter={(value) => `${value}M`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1f2c",
            border: "none",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="volume"
          stroke="#4fd1c5"
          fillOpacity={1}
          fill="url(#colorVolume)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}