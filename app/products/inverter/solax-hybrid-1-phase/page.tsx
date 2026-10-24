import type { Metadata } from "next";
import InverterSubcategoryPage from "@/component/InverterSubcategoryPage";

export const metadata: Metadata = {
  title: "Inverter SolaX Hybrid 1 Phase | MB Solar",
};

export default function SolaxHybrid1PhasePage() {
  return (
    <InverterSubcategoryPage
      brand="solax"
      phase="1"
      title="Inverter SolaX Hybrid 1 phase"
      description="Các sản phẩm inverter hybrid SolaX 1 phase."
    />
  );
}
