import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PriceChart } from "@/components/PriceChart";
import { PriceKPICards } from "@/components/PriceKPICards";
import { SlopeChart } from "@/components/SlopeChart";
import { ImportPaymentChart } from "@/components/ImportPaymentChart";

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

            <PriceKPICards />

            <div className="grid gap-6 md:grid-cols-2">
              <PriceChart />
              <SlopeChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SlopeChart title="Price Trend" showPrice={true} />
              <ImportPaymentChart />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}