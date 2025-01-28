import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Period = "monthly" | "quarterly" | "yearly";

interface PeriodSelectorProps {
  selectedPeriod: Period;
  selectedYear: string;
  onPeriodChange: (value: Period) => void;
  onYearChange: (value: string) => void;
  showYearFilter: boolean;
  years: string[];
}

export function PeriodSelector({
  selectedPeriod,
  selectedYear,
  onPeriodChange,
  onYearChange,
  showYearFilter,
  years,
}: PeriodSelectorProps) {
  return (
    <div className="flex gap-4 mb-4">
      <Select
        value={selectedPeriod}
        onValueChange={(value: Period) => onPeriodChange(value)}
      >
        <SelectTrigger className="w-[180px] hover:bg-dashboard-navy/80">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="quarterly">Quarterly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>
      {showYearFilter && (
        <Select
          value={selectedYear}
          onValueChange={onYearChange}
        >
          <SelectTrigger className="w-[120px] hover:bg-dashboard-navy/80">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.filter(year => year !== "all").map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}