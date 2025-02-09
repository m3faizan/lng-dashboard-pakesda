
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { GenerationKPICards } from "@/components/GenerationKPICards";
import { GenerationChart } from "@/components/GenerationChart";
import { CostChart } from "@/components/CostChart";
import { MixChart } from "@/components/MixChart";
import { SystemGenerationChart } from "@/components/SystemGenerationChart";
import { PlantsTable } from "@/components/PlantsTable";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function GenerationMetrics() {
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestDate = async () => {
      try {
        const { data } = await supabase
          .from('LNG Power Gen')
          .select('date')
          .order('date', { ascending: false })
          .limit(1);

        if (data && data[0]?.date) {
          const dateObj = new Date(data[0].date);
          setLatestDate(dateObj.toLocaleString('default', { month: 'long', year: 'numeric' }));
        }
      } catch (error) {
        console.error('Error fetching date:', error);
        toast({
          title: "Error",
          description: "Failed to load latest date",
          variant: "destructive",
        });
      }
    };

    fetchLatestDate();
  }, [toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-y-auto scrollbar-hide">
          <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-left">Generation Metrics</h1>
              {latestDate && (
                <div className="bg-[#1A1E2D] rounded-md px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">As of: {latestDate}</span>
                </div>
              )}
            </div>

            <GenerationKPICards />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 bg-dashboard-navy rounded-lg border-0">
                <CostChart />
              </div>
              <div className="p-6 bg-dashboard-navy rounded-lg border-0">
                <MixChart />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 bg-dashboard-navy rounded-lg border-0">
                <SystemGenerationChart />
              </div>
              <div className="p-6 bg-dashboard-navy rounded-lg border-0">
                <PlantsTable />
              </div>
            </div>

            <div className="p-6 bg-dashboard-navy rounded-lg border-0">
              <GenerationChart />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
