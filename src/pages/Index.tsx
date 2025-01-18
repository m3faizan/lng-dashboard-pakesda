import { SidebarProvider } from "@/components/ui/sidebar";
import { KPICard } from "@/components/KPICard";
import { LNGChart } from "@/components/LNGChart";
import { LNGBarChart } from "@/components/LNGBarChart";
import { AppSidebar } from "@/components/AppSidebar";
import {
  BarChart3,
  Ship,
  DollarSign,
  Zap,
  LayoutDashboard,
  MapPin,
  LineChart,
  Gauge,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "#",
  },
  {
    title: "LNG Terminals",
    icon: MapPin,
    url: "#terminals",
  },
  {
    title: "Import Statistics",
    icon: BarChart3,
    url: "#imports",
  },
  {
    title: "Pricing Metrics",
    icon: LineChart,
    url: "#pricing",
  },
  {
    title: "Generation Metrics",
    icon: Gauge,
    url: "#generation",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#settings",
  },
];

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">LNG Dashboard</h1>
              <div className="flex gap-4">
                <button className="p-2 rounded-full bg-dashboard-navy">
                  <Ship className="h-5 w-5 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-full bg-dashboard-navy">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

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

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="p-6 bg-dashboard-navy rounded-lg border-0">
                <h2 className="text-lg font-semibold mb-4">
                  LNG Import Volumes (MMBTU)
                </h2>
                <LNGChart />
              </div>
              
              <div className="p-6 bg-dashboard-navy rounded-lg border-0">
                <LNGBarChart />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}