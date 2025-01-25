import { KPICard } from "@/components/KPICard";
import { Gauge, DollarSign, Percent } from "lucide-react";

export function GenerationKPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <KPICard
        title="RLNG Power Generation"
        value="1,234 GWh"
        icon={<Gauge className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 5.2, isPositive: true }}
      />
      <KPICard
        title="RLNG Power Gen Cost"
        value="28.5 PKR/kWh"
        icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 2.1, isPositive: false }}
      />
      <KPICard
        title="RLNG Power Gen Share"
        value="18.5%"
        icon={<Percent className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 1.5, isPositive: true }}
      />
    </div>
  );
}