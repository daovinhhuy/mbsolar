import type { Metadata } from "next";
import InverterSubcategoryPage from "@/component/InverterSubcategoryPage";

export const metadata: Metadata = {
  title: "Inverter SolaX Hybrid 3 Phase | MB Solar",
};

export default function SolaxHybrid3PhasePage() {
  return (
    <InverterSubcategoryPage
      brand="solax"
      phase="3"
      title="Inverter SolaX Hybrid 3 phase"
      description="Các sản phẩm inverter hybrid SolaX 3 phase."
    />
  );
}
