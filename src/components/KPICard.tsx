import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ title, value, icon, trend, className }: KPICardProps) {
  return (
    <Card className={cn("bg-dashboard-navy border-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground text-left">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-dashboard-dark/50 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between min-h-[80px]">
        <div className="text-xl font-bold text-left">{value}</div>
        {trend && (
          <p
            className={cn(
              "text-xs flex items-center gap-1 mt-auto",
              trend.isPositive ? "text-dashboard-green" : "text-red-500"
            )}
          >
            {trend.isPositive ? "+" : "-"}
            {trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}