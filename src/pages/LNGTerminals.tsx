import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TerminalKPICards } from "@/components/TerminalKPICards";
import { CargoActivityChart } from "@/components/CargoActivityChart";
import { PortChargesChart } from "@/components/PortChargesChart";
import { CargoCalendar } from "@/components/CargoCalendar";
import { TerminalsTable } from "@/components/TerminalsTable";

export default function LNGTerminals() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">LNG Terminals</h1>
            </div>

            <TerminalKPICards />

            <div className="grid gap-6 md:grid-cols-2">
              <CargoActivityChart />
              <PortChargesChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <CargoCalendar />
            </div>

            <TerminalsTable />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}