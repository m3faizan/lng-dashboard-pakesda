import { KPICard } from "@/components/KPICard";
import { PriceChart } from "@/components/PriceChart";
import { SlopeChart } from "@/components/SlopeChart";
import { TopProducts } from "@/components/TopProducts";
import { ImportPayment } from "@/components/ImportPayment";
import { BrentChart } from "@/components/BrentChart";
import { DollarSign, TrendingUp, ShoppingBag, Users } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function PricingMetrics() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-dashboard-dark p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            <h1 className="text-2xl font-bold mb-6">Price Metrics</h1>
            
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PriceChart />
              <SlopeChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopProducts />
              <SlopeChart title="Price Slope" showPrice />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImportPayment />
              <BrentChart />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}