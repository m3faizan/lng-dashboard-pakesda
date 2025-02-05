import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { GenerationKPICards } from "@/components/GenerationKPICards";
import { GenerationChart } from "@/components/GenerationChart";
import { CostChart } from "@/components/CostChart";
import { MixChart } from "@/components/MixChart";
import { SystemGenerationChart } from "@/components/SystemGenerationChart";
import { PlantsTable } from "@/components/PlantsTable";

export default function GenerationMetrics() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 pl-4 pr-8 py-8 overflow-auto">
          <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Generation Metrics</h1>
            </div>

            <GenerationKPICards />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-dashboard-navy rounded-lg border-0">
                <GenerationChart />
              </div>
              <div className="p-4 bg-dashboard-navy rounded-lg border-0">
                <CostChart />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-dashboard-navy rounded-lg border-0">
                <MixChart />
              </div>
              <div className="p-4 bg-dashboard-navy rounded-lg border-0">
                <SystemGenerationChart />
              </div>
            </div>

            <div className="p-4 bg-dashboard-navy rounded-lg border-0">
              <PlantsTable />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}