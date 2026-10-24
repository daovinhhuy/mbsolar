import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ SolaX | MB Solar",
};

export default function SolaxStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categorySlug="solax-battery-low-voltage"
      title="Pin lưu trữ SolaX"
      description="Pin lưu trữ SolaX dạng mô-đun, dễ mở rộng cho nhu cầu điện gia đình."
    />
  );
}
