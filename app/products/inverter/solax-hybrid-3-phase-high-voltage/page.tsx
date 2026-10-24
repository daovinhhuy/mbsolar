import type { Metadata } from "next";
import InverterSubcategoryPage from "@/component/InverterSubcategoryPage";

export const metadata: Metadata = {
  title: "Inverter SolaX Hybrid 3 Phase Áp Cao | MB Solar",
};

export default function SolaxHybrid3PhaseHighVoltagePage() {
  return (
    <InverterSubcategoryPage
      brand="solax"
      phase="3"
      voltage="high"
      title="Inverter SolaX Hybrid 3 phase áp cao"
      description="Các sản phẩm inverter hybrid SolaX 3 phase điện áp cao."
    />
  );
}
