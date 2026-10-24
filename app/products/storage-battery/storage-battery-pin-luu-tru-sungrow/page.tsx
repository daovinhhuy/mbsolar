import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ SUNGROW | MB Solar",
};

export default function SungrowStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categorySlug="sungrow-battery-low-voltage"
      title="Pin Lưu trữ SUNGROW"
      description="Pin lưu trữ SUNGROW cho hệ thống điện mặt trời dân dụng và thương mại."
    />
  );
}
