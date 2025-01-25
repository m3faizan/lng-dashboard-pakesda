import { LNGChart } from "@/components/LNGChart";

export function MixChart() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">RLNG in Generation Mix (%)</h2>
      <LNGChart />
    </div>
  );
}