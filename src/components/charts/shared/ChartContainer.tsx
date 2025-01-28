import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  headerContent?: ReactNode;
}

export function ChartContainer({ title, children, headerContent }: ChartContainerProps) {
  return (
    <Card className="bg-dashboard-navy border-0">
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle className="text-lg font-semibold mb-4">{title}</CardTitle>
        {headerContent}
      </CardHeader>
      <CardContent className="h-[320px] pt-8">
        {children}
      </CardContent>
    </Card>
  );
}