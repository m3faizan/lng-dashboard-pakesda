import { timeframes } from "@/lib/constants";

interface TimeFrameSelectorProps {
  selectedTimeframe: number;
  onTimeframeChange: (months: number) => void;
  color: string;
}

export function TimeFrameSelector({ selectedTimeframe, onTimeframeChange, color }: TimeFrameSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="flex gap-2">
        {timeframes.map((tf) => (
          <button
            key={tf.label}
            onClick={() => onTimeframeChange(tf.months)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedTimeframe === tf.months
                ? `bg-${color} text-white shadow-sm`
                : "bg-dashboard-navy text-muted-foreground hover:bg-dashboard-navy/80 hover:text-white"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
    </div>
  );
}