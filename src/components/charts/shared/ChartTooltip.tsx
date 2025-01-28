import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<any, any> {
  valueFormatter?: (value: number) => string;
  labelFormatter?: (value: any) => string;
}

export function ChartTooltip({ 
  active, 
  payload, 
  valueFormatter = (value) => `${value}`,
  labelFormatter = (value) => `${value}`,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#1A1E2D] border border-gray-700 rounded-lg p-3 text-sm shadow-lg">
      <div className="text-gray-400 mb-1">{payload[0].payload.date}</div>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="whitespace-nowrap text-white">
          <span>{labelFormatter(entry.name)}: </span>
          <span className="font-mono font-medium">
            {valueFormatter(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}