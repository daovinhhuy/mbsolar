import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ Hithium | MB Solar",
};

export default function HithiumStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categorySlug="hithium-battery-low-voltage"
      title="Pin lưu trữ Hithium"
      description="Pin lưu trữ Hithium điện áp thấp, phù hợp cho hệ thống điện mặt trời dân dụng."
    />
  );
}
