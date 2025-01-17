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
    <Card className={cn("bg-dashboard-navy/50 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={cn(
              "mt-2 text-xs",
              trend.isPositive ? "text-green-500" : "text-red-500"
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