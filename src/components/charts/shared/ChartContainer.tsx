
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
    <Card className={cn("bg-dashboard-navy border-0 h-[550px] md:h-[550px]", className)}>
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-lg font-semibold mb-4">{title}</CardTitle>
        {headerContent}
      </CardHeader>
      <CardContent className="h-[350px] md:h-[420px] pt-4 md:pt-8 pb-20">
        {children}
      </CardContent>
    </Card>
  );
}
