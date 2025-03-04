
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PriceKPICards } from "@/components/PriceKPICards";
import { LNGDESPriceChart } from "@/components/charts/LNGDESPriceChart";
import { ContractSlopeChart } from "@/components/charts/ContractSlopeChart";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LNGBarChart } from "@/components/LNGBarChart";

export default function PriceMetrics() {
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestDate = async () => {
      try {
        const { data } = await supabase
          .from('LNG Port_Price_Import')
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
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-hide">
          <div className="space-y-6 md:space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold text-left">Price Metrics</h1>
              {latestDate && (
                <div className="bg-[#1A1E2D] rounded-md px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">As of: {latestDate}</span>
                </div>
              )}
            </div>

            <PriceKPICards />

            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              <LNGDESPriceChart />
              <LNGBarChart />
            </div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              <ContractSlopeChart />
              <PriceTrendChart />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
