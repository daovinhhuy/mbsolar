import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ SOLIS | MB Solar",
};

export default function SolisStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categoryName={"Pin l\u01b0u tr\u1eef Solis \u0111i\u1ec7n \u00e1p th\u1ea5p"}
      title="Pin Lưu trữ SOLIS"
      description="Pin lưu trữ SOLIS cho hệ thống điện mặt trời dân dụng và thương mại."
    />
  );
}
