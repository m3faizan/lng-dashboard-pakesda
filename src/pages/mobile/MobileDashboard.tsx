
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { KPICard } from "@/components/KPICard";
import { ImportPaymentsChart } from "@/components/ImportPaymentsChart";
import { ImportVolumeChart } from "@/components/ImportVolumeChart";
import { Ship, DollarSign, TrendingUp } from "lucide-react";

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

      <div className="grid gap-4">
        <KPICard
          title="LNG Imports"
          value="2.1M MMBtu"
          icon={<Ship className="h-4 w-4 text-dashboard-green" />}
          trend={{ value: 5.2, isPositive: true }}
          type="imports"
        />
        <KPICard
          title="Import Payments"
          value="$45.2M"
          icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
          trend={{ value: 2.8, isPositive: false }}
          type="cost"
        />
        <KPICard
          title="Brent Price"
          value="$82.5/bbl"
          icon={<TrendingUp className="h-4 w-4 text-dashboard-green" />}
          trend={{ value: 1.5, isPositive: true }}
          type="price"
        />
      </div>

      <div className="space-y-6">
        <ImportPaymentsChart />
        <ImportVolumeChart />
      </div>
    </div>
  );
}
