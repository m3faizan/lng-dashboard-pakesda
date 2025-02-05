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
  type?: 'generation' | 'cost' | 'share' | 'imports' | 'cargoes' | 'price';
}

export function KPICard({ title, value, icon, trend, className, type = 'share' }: KPICardProps) {
  const getTrendColor = (isPositive: boolean, type: string) => {
    switch (type) {
      case 'cost':
      case 'price':
        return !isPositive ? "text-dashboard-green" : "text-red-500";
      case 'generation':
      case 'share':
      case 'imports':
      case 'cargoes':
      default:
        return isPositive ? "text-dashboard-green" : "text-red-500";
    }
  };

  return (
    <Card className={cn("bg-dashboard-navy border-0 min-w-[250px]", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground text-left">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-dashboard-dark/50 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="h-[100px] flex flex-col">
        <div className="text-xl md:text-2xl font-bold text-left mb-auto break-words">{value}</div>
        {trend && (
          <div className="mt-auto text-left">
            <p
              className={cn(
                "text-xs flex items-center gap-1",
                getTrendColor(trend.isPositive, type)
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value.toFixed(1)}% from last month
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}