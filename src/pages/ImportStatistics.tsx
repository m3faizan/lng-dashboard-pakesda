import { ImportVolumeChart } from "@/components/ImportVolumeChart";
import { LNGBarChart } from "@/components/LNGBarChart";
import { KPICard } from "@/components/KPICard";
import { DollarSign, Droplet, Ship } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ContractVolumesChart } from "@/components/ContractVolumesChart";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface KPIData {
  payment: { value: number; trend: number };
  volume: { value: number; trend: number };
  cargo: { value: number; trend: number };
}

export default function ImportStatistics() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        // Get latest and previous month data for LNG Power Gen
        const { data: powerGenData } = await supabase
          .from('LNG Power Gen')
          .select('date, importPayment')
          .order('date', { ascending: false })
          .limit(2);

        // Get latest and previous month data for LNG Information
        const { data: lngInfo } = await supabase
          .from('LNG Information')
          .select('date, import_Volume, Total_Cargoes')
          .order('date', { ascending: false })
          .limit(2);

        if (powerGenData && lngInfo && powerGenData[0]?.date) {
          const dateObj = new Date(powerGenData[0].date);
          setLatestDate(dateObj.toLocaleString('default', { month: 'long', year: 'numeric' }));
          
          const calculateTrend = (current: number, previous: number) => {
            return previous ? ((current - previous) / previous) * 100 : 0;
          };

          setKpiData({
            payment: {
              value: (powerGenData[0]?.importPayment || 0) / 1000, // Convert to millions
              trend: calculateTrend(
                powerGenData[0]?.importPayment || 0,
                powerGenData[1]?.importPayment || 0
              ),
            },
            volume: {
              value: lngInfo[0]?.import_Volume || 0,
              trend: calculateTrend(
                lngInfo[0]?.import_Volume || 0,
                lngInfo[1]?.import_Volume || 0
              ),
            },
            cargo: {
              value: lngInfo[0]?.Total_Cargoes || 0,
              trend: calculateTrend(
                lngInfo[0]?.Total_Cargoes || 0,
                lngInfo[1]?.Total_Cargoes || 0
              ),
            },
          });
        }
      } catch (error) {
        console.error('Error fetching KPI data:', error);
        toast({
          title: "Error",
          description: "Failed to load statistics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIData();
  }, [toast]);

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value.toFixed(1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-left">Import Statistics</h1>
              {latestDate && (
                <div className="bg-[#1A1E2D] rounded-md px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">As of: {latestDate}</span>
                </div>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <KPICard
                title="Import Payment"
                value={`$${(kpiData?.payment.value || 0).toFixed(1)}M`}
                icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
                trend={{ 
                  value: Math.abs(kpiData?.payment.trend || 0), 
                  isPositive: (kpiData?.payment.trend || 0) > 0 
                }}
                type="imports"
              />
              <KPICard
                title="Import Volume"
                value={`${((kpiData?.volume.value || 0) / 1000000).toFixed(1)}M MMBtu`}
                icon={<Droplet className="h-4 w-4 text-dashboard-blue" />}
                trend={{ 
                  value: Math.abs(kpiData?.volume.trend || 0), 
                  isPositive: (kpiData?.volume.trend || 0) > 0 
                }}
                type="imports"
              />
              <KPICard
                title="Importing Cargo"
                value={kpiData?.cargo.value.toFixed(1) || "0"}
                icon={<Ship className="h-4 w-4 text-dashboard-coral" />}
                trend={{ 
                  value: Math.abs(kpiData?.cargo.trend || 0), 
                  isPositive: (kpiData?.cargo.trend || 0) > 0 
                }}
                type="cargoes"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ImportVolumeChart />
              <ContractVolumesChart />
            </div>
            
            <div className="w-full">
              <LNGBarChart />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
