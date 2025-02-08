
import { KPICard } from "@/components/KPICard";
import { Ship, Package, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function TerminalKPICards() {
  const [cargoData, setCargoData] = useState<{
    EETL: number | null;
    PGPCL: number | null;
    prevEETL: number | null;
    prevPGPCL: number | null;
  }>({
    EETL: null,
    PGPCL: null,
    prevEETL: null,
    prevPGPCL: null
  });

  const [portCharges, setPortCharges] = useState<{
    current: number | null;
    previous: number | null;
  }>({
    current: null,
    previous: null
  });

  useEffect(() => {
    const fetchData = async () => {
      // Get the latest month's cargo data
      const { data: latestCargoData, error: cargoError } = await supabase
        .from('LNG Information')
        .select('date, EETL_cargo, PGPCL_cargo')
        .order('date', { ascending: false })
        .limit(2);

      if (cargoError) {
        console.error('Error fetching cargo data:', cargoError);
        return;
      }

      if (latestCargoData && latestCargoData.length > 0) {
        setCargoData({
          EETL: latestCargoData[0].EETL_cargo,
          PGPCL: latestCargoData[0].PGPCL_cargo,
          prevEETL: latestCargoData[1]?.EETL_cargo,
          prevPGPCL: latestCargoData[1]?.PGPCL_cargo
        });
      }

      // Get the latest port charges data
      const { data: latestPortCharges, error: portError } = await supabase
        .from('LNG Port_Price_Import')
        .select('date, wAvg_Port_Charges')
        .order('date', { ascending: false })
        .limit(2);

      if (portError) {
        console.error('Error fetching port charges:', portError);
        return;
      }

      if (latestPortCharges && latestPortCharges.length > 0) {
        setPortCharges({
          current: latestPortCharges[0].wAvg_Port_Charges,
          previous: latestPortCharges[1]?.wAvg_Port_Charges
        });
      }
    };

    fetchData();
  }, []);

  const calculateTrend = (current: number | null, previous: number | null) => {
    if (current === null || previous === null || previous === 0) return undefined;
    const percentChange = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(percentChange),
      isPositive: percentChange > 0
    };
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <KPICard
        title="Cargoes at EETL"
        value={cargoData.EETL !== null ? Math.round(cargoData.EETL).toString() : "Loading..."}
        icon={<Ship className="h-4 w-4 text-dashboard-green" />}
        trend={calculateTrend(cargoData.EETL, cargoData.prevEETL)}
      />
      <KPICard
        title="Cargoes at PGPCL"
        value={cargoData.PGPCL !== null ? Math.round(cargoData.PGPCL).toString() : "Loading..."}
        icon={<Package className="h-4 w-4 text-dashboard-green" />}
        trend={calculateTrend(cargoData.PGPCL, cargoData.prevPGPCL)}
      />
      <KPICard
        title="Terminal Charges"
        value={portCharges.current !== null ? `$${portCharges.current.toFixed(2)}/MMBtu` : "Loading..."}
        icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
        trend={calculateTrend(portCharges.current, portCharges.previous)}
        type="cost"
      />
    </div>
  );
}
