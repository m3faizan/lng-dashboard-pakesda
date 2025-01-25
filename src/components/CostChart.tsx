import { LNGChart } from "@/components/LNGChart";

export function CostChart() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">RLNG Gen Cost (PKR/kWh)</h2>
      <LNGChart />
    </div>
  );
}