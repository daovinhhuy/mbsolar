import type { Metadata } from "next";
import InverterSubcategoryPage from "@/component/InverterSubcategoryPage";

export const metadata: Metadata = {
  title: "Inverter Sungrow Hybrid 1 Phase | MB Solar",
};

export default function SungrowHybrid1PhasePage() {
  return (
    <InverterSubcategoryPage
      brand="sungrow"
      phase="1"
      title="Inverter Sungrow Hybrid 1 phase"
      description="Các sản phẩm inverter hybrid Sungrow 1 phase."
    />
  );
}
