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
        <main className="flex-1 px-4 py-8 overflow-x-hidden">
          <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">Generation Metrics</h1>
            </div>

            <div className="w-full overflow-x-auto">
              <GenerationKPICards />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="w-full min-w-0 p-4 bg-dashboard-navy rounded-lg border-0">
                <GenerationChart />
              </div>
              <div className="w-full min-w-0 p-4 bg-dashboard-navy rounded-lg border-0">
                <CostChart />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="w-full min-w-0 p-4 bg-dashboard-navy rounded-lg border-0">
                <MixChart />
              </div>
              <div className="w-full min-w-0 p-4 bg-dashboard-navy rounded-lg border-0">
                <SystemGenerationChart />
              </div>
            </div>

            <div className="w-full overflow-x-auto p-4 bg-dashboard-navy rounded-lg border-0">
              <PlantsTable />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}