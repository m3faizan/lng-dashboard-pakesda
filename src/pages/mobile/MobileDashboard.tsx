
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImportVolumeChart } from "@/components/ImportVolumeChart";
import { LNGDESPriceChart } from "@/components/charts/LNGDESPriceChart";
import { TotalCargoesChart } from "@/components/TotalCargoesChart";
import { GenerationChart } from "@/components/GenerationChart";

export default function MobileDashboard() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMobile) {
      navigate("/dashboard");
    }
  }, [isMobile, navigate]);

  return (
    <div className="min-h-screen bg-dashboard-dark text-white p-4 space-y-6">
      <header className="py-4">
        <h1 className="text-xl font-semibold text-center">LNG Dashboard</h1>
      </header>

      <div className="space-y-6">
        {/* Import Volume Chart */}
        <ImportVolumeChart />
        
        {/* LNG DES Price Chart */}
        <LNGDESPriceChart />
        
        {/* Total Cargoes Chart */}
        <TotalCargoesChart />
        
        {/* RLNG Power Generation Chart */}
        <GenerationChart />
      </div>
    </div>
  );
}
