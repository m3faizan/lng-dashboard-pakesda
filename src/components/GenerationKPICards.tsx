import { KPICard } from "@/components/KPICard";
import { Gauge, DollarSign, Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PowerGenData {
  powerGeneration: number;
  powerGenCost: number;
  rlngShare: number;
  date: string;
}

export function GenerationKPICards() {
  const [currentData, setCurrentData] = useState<PowerGenData | null>(null);
  const [previousData, setPreviousData] = useState<PowerGenData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the latest data
        const { data: latestData, error: latestError } = await supabase
          .from('LNG Power Gen')
          .select('date, powerGeneration, powerGenCost, rlngShare')
          .order('date', { ascending: false })
          .limit(1)
          .single();

        if (latestError) throw latestError;

        // Get the previous month's data
        const previousDate = new Date(latestData.date);
        previousDate.setMonth(previousDate.getMonth() - 1);

        const { data: previousMonthData, error: previousError } = await supabase
          .from('LNG Power Gen')
          .select('date, powerGeneration, powerGenCost, rlngShare')
          .eq('date', previousDate.toISOString().split('T')[0])
          .single();

        if (previousError) throw previousError;

        setCurrentData(latestData);
        setPreviousData(previousMonthData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  const calculateTrend = (current: number, previous: number) => {
    const percentageChange = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(percentageChange),
      isPositive: percentageChange > 0
    };
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!currentData || !previousData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <KPICard
        title="RLNG Power Generation"
        value={`${currentData.powerGeneration.toFixed(1)} GWh`}
        icon={<Gauge className="h-4 w-4 text-dashboard-green" />}
        trend={calculateTrend(currentData.powerGeneration, previousData.powerGeneration)}
        type="generation"
      />
      <KPICard
        title="RLNG Power Gen Cost"
        value={`${currentData.powerGenCost.toFixed(1)} PKR/kWh`}
        icon={<DollarSign className="h-4 w-4 text-dashboard-green" />}
        trend={calculateTrend(currentData.powerGenCost, previousData.powerGenCost)}
        type="cost"
      />
      <KPICard
        title="RLNG Power Gen Share"
        value={`${currentData.rlngShare.toFixed(1)}%`}
        icon={<Percent className="h-4 w-4 text-dashboard-green" />}
        trend={calculateTrend(currentData.rlngShare, previousData.rlngShare)}
        type="share"
      />
    </div>
  );
}