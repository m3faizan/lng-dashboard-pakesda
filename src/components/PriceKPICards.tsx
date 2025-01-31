import { KPICard } from "@/components/KPICard";
import { Ship, Package, Gauge, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface KPIData {
  price: { value: number; trend: number };
  slope: { value: number; trend: number };
  brent: { value: number; trend: number };
  payment: { value: number; trend: number };
}

export function PriceKPICards() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        // Get latest and previous month data for LNG Port_Price_Import
        const { data: priceData } = await supabase
          .from('LNG Port_Price_Import')
          .select('date, wAvg_DES, DES_Slope')
          .order('date', { ascending: false })
          .limit(2);

        // Get latest and previous month data for LNG Power Gen
        const { data: powerGenData } = await supabase
          .from('LNG Power Gen')
          .select('date, brentAvg, importPayment')
          .order('date', { ascending: false })
          .limit(2);

        if (priceData && powerGenData) {
          const calculateTrend = (current: number, previous: number) => {
            return previous ? ((current - previous) / previous) * 100 : 0;
          };

          setKpiData({
            price: {
              value: priceData[0]?.wAvg_DES || 0,
              trend: calculateTrend(
                priceData[0]?.wAvg_DES || 0,
                priceData[1]?.wAvg_DES || 0
              ),
            },
            slope: {
              value: priceData[0]?.DES_Slope || 0,
              trend: calculateTrend(
                priceData[0]?.DES_Slope || 0,
                priceData[1]?.DES_Slope || 0
              ),
            },
            brent: {
              value: powerGenData[0]?.brentAvg || 0,
              trend: calculateTrend(
                powerGenData[0]?.brentAvg || 0,
                powerGenData[1]?.brentAvg || 0
              ),
            },
            payment: {
              value: (powerGenData[0]?.importPayment || 0) / 1000, // Convert to millions
              trend: calculateTrend(
                powerGenData[0]?.importPayment || 0,
                powerGenData[1]?.importPayment || 0
              ),
            },
          });
        }
      } catch (error) {
        console.error('Error fetching KPI data:', error);
        toast({
          title: "Error",
          description: "Failed to load price metrics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIData();
  }, [toast]);

  const formatNumber = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="LNG Price"
        value={`${formatNumber(kpiData?.price.value || 0)}$/MMBtu`}
        icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
        trend={{ 
          value: Math.abs(kpiData?.price.trend || 0), 
          isPositive: (kpiData?.price.trend || 0) > 0 
        }}
        type="price"
      />
      <KPICard
        title="Contract Slope"
        value={`${formatNumber(kpiData?.slope.value || 0)}%`}
        icon={<Package className="h-4 w-4 text-dashboard-green" />}
        trend={{ 
          value: Math.abs(kpiData?.slope.trend || 0), 
          isPositive: (kpiData?.slope.trend || 0) > 0 
        }}
        type="price"
      />
      <KPICard
        title="3M Avg Brent"
        value={`${formatNumber(kpiData?.brent.value || 0)}$/barrel`}
        icon={<Gauge className="h-4 w-4 text-dashboard-green" />}
        trend={{ 
          value: Math.abs(kpiData?.brent.trend || 0), 
          isPositive: (kpiData?.brent.trend || 0) > 0 
        }}
        type="price"
      />
      <KPICard
        title="LNG Import Pymt"
        value={`${formatNumber(kpiData?.payment.value || 0)}M$`}
        icon={<Ship className="h-4 w-4 text-dashboard-green" />}
        trend={{ 
          value: Math.abs(kpiData?.payment.trend || 0), 
          isPositive: (kpiData?.payment.trend || 0) > 0 
        }}
        type="price"
      />
    </div>
  );
}