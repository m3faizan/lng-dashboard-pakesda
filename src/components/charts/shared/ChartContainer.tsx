
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  headerContent?: ReactNode;
  className?: string;
}

export function ChartContainer({ title, children, headerContent, className }: ChartContainerProps) {
  return (
    <Card className={cn("bg-dashboard-navy border-0 h-[350px] md:h-[480px] w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg overflow-hidden", className)}>
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-lg md:text-xl font-semibold mb-2">{title}</CardTitle>
        {headerContent}
      </CardHeader>
      <CardContent className="h-[300px] md:h-[400px] px-2 md:px-3 pb-4 md:pb-6">
        {children}
      </CardContent>
    </Card>
  );
}
