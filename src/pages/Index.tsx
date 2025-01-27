import { KPICard } from "@/components/KPICard";
import { LNGChart } from "@/components/LNGChart";
import { LNGBarChart } from "@/components/LNGBarChart";
import { CargoTypesChart } from "@/components/CargoTypesChart";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Ship, BarChart3, DollarSign, Zap } from "lucide-react";

export default function Index() {
  return (
    <DashboardLayout title="LNG Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total LNG Imports"
          value="2.5M MMBTU"
          icon={<Ship className="h-4 w-4 text-dashboard-green" />}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Total Cargoes"
          value="24"
          icon={<BarChart3 className="h-4 w-4 text-dashboard-green" />}
          trend={{ value: 4, isPositive: true }}
        />
        <KPICard
          title="Avg Contract Price"
          value="$14.5/MMBTU"
          icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
          trend={{ value: 2.5, isPositive: false }}
        />
        <KPICard
          title="Power Gen Share"
          value="18.5%"
          icon={<Zap className="h-4 w-4 text-dashboard-green" />}
          trend={{ value: 1.2, isPositive: true }}
        />
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-dashboard-navy rounded-lg border-0">
          <h2 className="text-xl font-semibold mb-4 text-center">
            LNG Import Volumes (MMBTU)
          </h2>
          <LNGChart />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <LNGBarChart />
          <CargoTypesChart />
        </div>
      </div>
    </DashboardLayout>
  );
}