import type { Metadata } from "next";
import InverterSubcategoryPage from "@/component/InverterSubcategoryPage";

export const metadata: Metadata = {
  title: "Inverter Solis Hybrid 1 Phase | MB Solar",
};

export default function SolisHybrid1PhasePage() {
  return (
    <InverterSubcategoryPage
      brand="solis"
      phase="1"
      title="Inverter Solis Hybrid 1 phase"
      description="Các sản phẩm inverter hybrid Solis 1 phase."
    />
  );
}
