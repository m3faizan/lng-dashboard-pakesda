import { Ship, BarChart3, DollarSign, Zap } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3
  },
  {
    title: "Import Statistics",
    url: "/import-statistics",
    icon: Ship
  },
  {
    title: "Price Metrics",
    url: "/price-metrics",
    icon: DollarSign
  },
  {
    title: "Generation Metrics",
    url: "/generation-metrics",
    icon: Zap
  }
];