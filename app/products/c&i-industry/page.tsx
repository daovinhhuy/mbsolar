import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Hệ thống C&I | MB Solar",
};

export default function CiIndustryPage() {
  return (
    <StorageBatterySubcategoryPage
      categoryName={"H\u1ec7 th\u1ed1ng l\u01b0u tr\u1eef c\u00f4ng nghi\u1ec7p C&I SolaX"}
      title="Hệ thống lưu trữ công nghiệp C&I SolaX"
      description="Các giải pháp lưu trữ SolaX quy mô thương mại và công nghiệp."
    />
  );
}
