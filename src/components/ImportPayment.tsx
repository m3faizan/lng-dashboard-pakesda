import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ImportPayment() {
  return (
    <Card className="bg-dashboard-navy border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Import Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-3xl font-bold">$6078.76</div>
          <p className="text-sm text-muted-foreground">
            LNG makes 80% of the total import payment
          </p>
          <div className="relative pt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Progress value={80} className="h-4 bg-dashboard-dark" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>80% of total import payment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}