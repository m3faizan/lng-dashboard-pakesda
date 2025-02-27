
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  headerContent?: ReactNode;
  className?: string;
}

export function ChartContainer({ title, children, headerContent, className }: ChartContainerProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn(
      "bg-dashboard-navy border-0 w-full transition-all duration-300 hover:ring-2 hover:ring-dashboard-blue/20 hover:shadow-lg overflow-hidden",
      isMobile ? "h-[350px]" : "h-[480px]",
      className
    )}>
      <CardHeader className={cn("flex flex-col items-center", isMobile ? "pb-1 pt-3" : "pb-2")}>
        <CardTitle className={cn("font-semibold mb-1", isMobile ? "text-base" : "text-lg md:text-xl mb-2")}>
          {title}
        </CardTitle>
        {headerContent}
      </CardHeader>
      <CardContent className={cn(
        isMobile ? "h-[280px] px-1 py-2" : "h-[400px] px-2 md:px-3 pb-4 md:pb-6"
      )}>
        {children}
      </CardContent>
    </Card>
  );
}
