import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Hệ thống lưu trữ công nghiệp C&I SolaX | MB Solar",
};

export default function SolaxCiIndustryPage() {
  return (
    <StorageBatterySubcategoryPage
      categorySlug="solax-ci-industrial-storage"
      title="Hệ thống lưu trữ công nghiệp C&I SolaX"
      description="Các giải pháp lưu trữ SolaX quy mô thương mại và công nghiệp."
    />
  );
}
