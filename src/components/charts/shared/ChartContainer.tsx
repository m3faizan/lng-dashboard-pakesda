
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
    <Card className={cn("bg-dashboard-navy border-0 h-[450px] md:h-[450px]", className)}>
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-lg font-semibold mb-4">{title}</CardTitle>
        {headerContent}
      </CardHeader>
      <CardContent className="h-[250px] md:h-[320px] pt-4 md:pt-8 pb-20">
        {children}
      </CardContent>
    </Card>
  );
}
