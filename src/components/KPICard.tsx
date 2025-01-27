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
    <Card className={cn("bg-dashboard-navy border-0 min-h-[160px]", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground text-left">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-dashboard-dark/50 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[100px]">
        <div className="text-2xl font-bold text-left">{value}</div>
        {trend && (
          <div className="mt-auto">
            <p
              className={cn(
                "text-xs flex items-center gap-1 absolute bottom-6",
                trend.isPositive ? "text-dashboard-green" : "text-red-500"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}% from last month
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}