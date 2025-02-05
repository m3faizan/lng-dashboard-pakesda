import type { Database } from "@/integrations/supabase/types";

export type PowerGenData = Database['public']['Tables']['LNG Power Gen']['Row'];

export interface ChartDataPoint {
  date: string;
  volume: number;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}