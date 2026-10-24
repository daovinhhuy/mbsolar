import type { Metadata } from "next";
import InverterSubcategoryPage from "@/component/InverterSubcategoryPage";

export const metadata: Metadata = {
  title: "Inverter Solis Hybrid 3 Phase | MB Solar",
};

export default function SolisHybrid3PhasePage() {
  return (
    <InverterSubcategoryPage
      brand="solis"
      phase="3"
      title="Inverter Solis Hybrid 3 phase"
      description="Các sản phẩm inverter hybrid Solis 3 phase."
    />
  );
}
