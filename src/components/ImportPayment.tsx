import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
            <div className="w-full h-4 bg-dashboard-dark rounded-full">
              <div
                className="absolute h-full rounded-full bg-dashboard-teal"
                style={{ width: "80%" }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}