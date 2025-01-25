import { KPICard } from "@/components/KPICard";
import { Ship, Package, Gauge, DollarSign } from "lucide-react";

export function TerminalKPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Cargoes at EETL"
        value="12"
        icon={<Ship className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 8.5, isPositive: true }}
      />
      <KPICard
        title="Cargoes at PGPCL"
        value="15"
        icon={<Package className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 5.2, isPositive: true }}
      />
      <KPICard
        title="Quantity Delivered at Port"
        value="2.5M MMBTU"
        icon={<Gauge className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 3.8, isPositive: true }}
      />
      <KPICard
        title="Terminal Charges"
        value="$0.45/MMBtu"
        icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
        trend={{ value: 2.1, isPositive: false }}
      />
    </div>
  );
}