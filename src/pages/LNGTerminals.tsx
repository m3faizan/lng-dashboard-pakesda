
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TerminalKPICards } from "@/components/TerminalKPICards";
import { CargoActivityChart } from "@/components/CargoActivityChart";
import { PortChargesChart } from "@/components/PortChargesChart";
import { TotalCargoesChart } from "@/components/TotalCargoesChart";
import { TerminalsTable } from "@/components/TerminalsTable";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function LNGTerminals() {
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestDate = async () => {
      try {
        const { data } = await supabase
          .from('LNG Information')
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
        <main className="flex-1 p-8 overflow-auto">
          <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-left">LNG Terminals</h1>
              {latestDate && (
                <div className="bg-dashboard-navy border border-border rounded-md px-4 py-2">
                  <span className="text-sm text-muted-foreground">As of: {latestDate}</span>
                </div>
              )}
            </div>

            <TerminalKPICards />

            <div className="grid gap-6 md:grid-cols-2">
              <CargoActivityChart />
              <TotalCargoesChart />
            </div>

            <PortChargesChart />

            <TerminalsTable />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
