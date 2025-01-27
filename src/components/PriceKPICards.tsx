import { KPICard } from "@/components/KPICard";
import { Ship, Package, Gauge, DollarSign } from "lucide-react";

export function PriceKPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="LNG Price"
        value="10$/MMBtu"
        icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 10, isPositive: true }}
      />
      <KPICard
        title="Contract Slope"
        value="10%"
        icon={<Package className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 8, isPositive: true }}
      />
      <KPICard
        title="3M Avg Brent"
        value="10$/barrel"
        icon={<Gauge className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 2, isPositive: true }}
      />
      <KPICard
        title="LNG Import Pymt"
        value="10M$"
        icon={<Ship className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}