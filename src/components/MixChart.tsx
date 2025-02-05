import { ChartContainer } from "@/components/charts/shared/ChartContainer";
import { PowerGenChart } from "@/components/PowerGenChart";

export function MixChart() {
  return (
    <ChartContainer title="RLNG in Generation Mix (%)" className="h-[480px]">
      <PowerGenChart 
        dataKey="rlngShare"
        color="#FEC6A1"
        valueFormatter={(value: number) => `${value.toFixed(2)}%`}
        label="RLNG Gen %"
        className="h-[400px] pb-8"
      />
    </ChartContainer>
  );
}