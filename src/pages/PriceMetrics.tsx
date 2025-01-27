import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PriceChart } from "@/components/PriceChart";
import { KPICard } from "@/components/KPICard";
import { DollarSign, TrendingUp, ShoppingBag, Users } from "lucide-react";

export default function PriceMetrics() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Price Metrics</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="LNG Price"
                value="10$/MMBtu"
                icon={<DollarSign className="h-4 w-4 text-dashboard-teal" />}
                trend={{ value: 10, isPositive: true }}
              />
              <KPICard
                title="Contract Slope"
                value="10%"
                icon={<TrendingUp className="h-4 w-4 text-dashboard-teal" />}
                trend={{ value: 8, isPositive: true }}
              />
              <KPICard
                title="3M Avg Brent"
                value="10$/barrel"
                icon={<ShoppingBag className="h-4 w-4 text-dashboard-teal" />}
                trend={{ value: 2, isPositive: true }}
              />
              <KPICard
                title="LNG Import Pymt"
                value="10M$"
                icon={<Users className="h-4 w-4 text-dashboard-teal" />}
                trend={{ value: 15, isPositive: true }}
              />
            </div>

            <div className="grid gap-6">
              <PriceChart />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}