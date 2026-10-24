import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ SOLIS | MB Solar",
};

export default function SolisStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categorySlug="solis-battery-low-voltage"
      title="Pin Lưu trữ SOLIS"
      description="Pin lưu trữ SOLIS cho hệ thống điện mặt trời dân dụng và thương mại."
    />
  );
}
