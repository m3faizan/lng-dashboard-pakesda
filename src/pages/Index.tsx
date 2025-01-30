import { SidebarProvider } from "@/components/ui/sidebar";
import { KPICard } from "@/components/KPICard";
import { LNGChart } from "@/components/LNGChart";
import { LNGBarChart } from "@/components/LNGBarChart";
import { CargoTypesChart } from "@/components/CargoTypesChart";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Ship,
  DollarSign,
  Zap,
  LayoutDashboard,
  MapPin,
  LineChart as LineChartIcon,
  Gauge as GaugeIcon,
  UserCircle2,
  LogOut,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "LNG Terminals",
    icon: MapPin,
    url: "/lng-terminals",
  },
  {
    title: "Import Statistics",
    icon: BarChart3,
    url: "/import-statistics",
  },
  {
    title: "Price Metrics",
    icon: LineChartIcon,
    url: "/price-metrics",
  },
  {
    title: "Generation Metrics",
    icon: GaugeIcon,
    url: "/generation-metrics",
  },
  {
    title: "Profile",
    icon: UserCircle2,
    url: "#profile",
    isProfile: true,
  },
  {
    title: "Logout",
    icon: LogOut,
    url: "#logout",
    isLogout: true,
  },
];

interface KPIData {
  imports: { value: number; trend: number };
  cargoes: { value: number; trend: number };
  price: { value: number; trend: number };
  share: { value: number; trend: number };
}

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        // Get latest and previous month data for LNG Information
        const { data: lngInfo } = await supabase
          .from('LNG Information')
          .select('date, import_Volume, Total_Cargoes')
          .order('date', { ascending: false })
          .limit(2);

        // Get latest and previous month data for LNG Port_Price_Import
        const { data: priceInfo } = await supabase
          .from('LNG Port_Price_Import')
          .select('date, wAvg_DES')
          .order('date', { ascending: false })
          .limit(2);

        // Get latest and previous month data for LNG Power Gen
        const { data: powerInfo } = await supabase
          .from('LNG Power Gen')
          .select('date, rlngShare')
          .order('date', { ascending: false })
          .limit(2);

        if (lngInfo && priceInfo && powerInfo) {
          const calculateTrend = (current: number, previous: number) => {
            return previous ? ((current - previous) / previous) * 100 : 0;
          };

          setKpiData({
            imports: {
              value: lngInfo[0]?.import_Volume || 0,
              trend: calculateTrend(
                lngInfo[0]?.import_Volume || 0,
                lngInfo[1]?.import_Volume || 0
              ),
            },
            cargoes: {
              value: lngInfo[0]?.Total_Cargoes || 0,
              trend: calculateTrend(
                lngInfo[0]?.Total_Cargoes || 0,
                lngInfo[1]?.Total_Cargoes || 0
              ),
            },
            price: {
              value: priceInfo[0]?.wAvg_DES || 0,
              trend: calculateTrend(
                priceInfo[0]?.wAvg_DES || 0,
                priceInfo[1]?.wAvg_DES || 0
              ),
            },
            share: {
              value: powerInfo[0]?.rlngShare || 0,
              trend: calculateTrend(
                powerInfo[0]?.rlngShare || 0,
                powerInfo[1]?.rlngShare || 0
              ),
            },
          });
        }
      } catch (error) {
        console.error('Error fetching KPI data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIData();
  }, [toast]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/");
    }
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value.toFixed(1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onLogout={handleLogout} />
        <main className="flex-1 p-8 overflow-auto">
          <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">LNG Dashboard</h1>
              <div className="flex gap-4">
                <button className="p-2 rounded-full bg-dashboard-navy">
                  <Ship className="h-5 w-5 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-full bg-dashboard-navy">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total LNG Imports"
                value={`${formatNumber(kpiData?.imports.value || 0)} MMBtu`}
                icon={<Ship className="h-4 w-4 text-dashboard-green" />}
                trend={{ 
                  value: Math.abs(kpiData?.imports.trend || 0), 
                  isPositive: (kpiData?.imports.trend || 0) > 0 
                }}
              />
              <KPICard
                title="Total Cargoes"
                value={kpiData?.cargoes.value.toString() || "0"}
                icon={<BarChart3 className="h-4 w-4 text-dashboard-green" />}
                trend={{ 
                  value: Math.abs(kpiData?.cargoes.trend || 0), 
                  isPositive: (kpiData?.cargoes.trend || 0) > 0 
                }}
              />
              <KPICard
                title="Avg Contract Price"
                value={`$${kpiData?.price.value.toFixed(1)}/MMBtu`}
                icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
                trend={{ 
                  value: Math.abs(kpiData?.price.trend || 0), 
                  isPositive: (kpiData?.price.trend || 0) > 0 
                }}
              />
              <KPICard
                title="Power Gen Share"
                value={`${kpiData?.share.value.toFixed(1)}%`}
                icon={<Zap className="h-4 w-4 text-dashboard-green" />}
                trend={{ 
                  value: Math.abs(kpiData?.share.trend || 0), 
                  isPositive: (kpiData?.share.trend || 0) > 0 
                }}
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
