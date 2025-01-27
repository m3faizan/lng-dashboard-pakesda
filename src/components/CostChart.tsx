import { LNGChart } from "@/components/LNGChart";

export function CostChart() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-center mb-5">RLNG Gen Cost (PKR/kWh)</h2>
      <LNGChart />
    </div>
  );
}