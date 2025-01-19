import { ImportVolumeChart } from "@/components/ImportVolumeChart";
import { LNGBarChart } from "@/components/LNGBarChart";

export default function ImportStatistics() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Import Statistics</h1>
      <ImportVolumeChart />
      <LNGBarChart />
    </div>
  );
}