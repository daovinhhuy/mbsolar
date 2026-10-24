import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ Dyness | MB Solar",
};

export default function DynessStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categorySlug="dyness-battery-low-voltage"
      title="Pin lưu trữ Dyness"
      description="Pin lưu trữ Dyness dạng tháp, linh hoạt cho nhiều quy mô hệ thống."
    />
  );
}
