import { ChartContainer } from "@/components/charts/shared/ChartContainer";
import { PowerGenChart } from "@/components/PowerGenChart";

export function GenerationChart() {
  return (
    <ChartContainer title="RLNG Power Generation (GWh)">
      <PowerGenChart 
        dataKey="powerGeneration"
        color="#4ADE80"
        valueFormatter={(value: number) => `${value.toFixed(2)} GWh`}
      />
    </ChartContainer>
  );
}