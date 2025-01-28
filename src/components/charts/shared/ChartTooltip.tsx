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
    <div className="bg-[#1A1E2D] border-none rounded-lg p-2 text-xs">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="whitespace-nowrap">
          <span className="text-muted-foreground">{labelFormatter(entry.name)}: </span>
          <span className="font-mono font-medium">
            {valueFormatter(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}