import { LNGChart } from "@/components/LNGChart";

export function GenerationChart() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-center mb-5">RLNG Power Generation (GWh)</h2>
      <LNGChart />
    </div>
  );
}