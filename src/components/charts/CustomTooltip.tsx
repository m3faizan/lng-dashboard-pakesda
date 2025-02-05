import { CustomTooltipProps } from "@/types/chart";

interface Props extends CustomTooltipProps {
  label: string;
  valueFormatter: (value: number) => string;
}

export function CustomTooltip({ active, payload, label, valueFormatter }: Props) {
  if (!active || !payload || !payload[0]) return null;
  
  return (
    <div className="bg-[#1A1E2D] border border-gray-700 rounded-lg p-3 text-sm shadow-lg">
      <div className="text-gray-400 mb-2">{payload[0].payload.date}</div>
      <div className="text-white">
        <span>{label}: </span>
        <span className="font-mono">{valueFormatter(payload[0].value)}</span>
      </div>
    </div>
  );
}