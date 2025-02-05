import { ChartContainer } from "@/components/charts/shared/ChartContainer";
import { PowerGenChart } from "@/components/PowerGenChart";

export function CostChart() {
  return (
    <ChartContainer title="RLNG Gen Cost (PKR/kWh)" className="h-[480px]">
      <PowerGenChart 
        dataKey="powerGenCost"
        color="#0EA5E9"
        valueFormatter={(value: number) => `${value.toFixed(2)} PKR/kWh`}
        label="RLNG Gen Cost"
        className="h-[400px] pb-8"
      />
    </ChartContainer>
  );
}