import { ChartContainer } from "@/components/charts/shared/ChartContainer";
import { PowerGenChart } from "@/components/PowerGenChart";

export function MixChart() {
  return (
    <ChartContainer title="RLNG in Generation Mix (%)">
      <PowerGenChart 
        dataKey="rlngShare"
        color="#FEC6A1"
        valueFormatter={(value: number) => `${value.toFixed(2)}%`}
        label="RLNG Gen %"
      />
    </ChartContainer>
  );
}