import { ImportVolumeChart } from "@/components/ImportVolumeChart";
import { LNGBarChart } from "@/components/LNGBarChart";
import { KPICard } from "@/components/KPICard";
import { DollarSign, Droplet, Ship } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ImportStatistics() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <h1 className="text-2xl font-bold">Import Statistics</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <KPICard
                title="Import Payment"
                value="$2.5M"
                icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
                trend={{ value: 12, isPositive: true }}
              />
              <KPICard
                title="Import Volume"
                value="1.8M MMBtu"
                icon={<Droplet className="h-4 w-4 text-dashboard-blue" />}
                trend={{ value: 8, isPositive: true }}
              />
              <KPICard
                title="Importing Cargo"
                value="24 Units"
                icon={<Ship className="h-4 w-4 text-dashboard-coral" />}
                trend={{ value: 15, isPositive: true }}
              />
            </div>

            <ImportVolumeChart />
            <LNGBarChart />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}