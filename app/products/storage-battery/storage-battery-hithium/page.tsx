import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ Hithium | MB Solar",
};

export default function HithiumStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categoryName={"Pin l\u01b0u tr\u1eef Hithium \u0111i\u1ec7n \u00e1p th\u1ea5p"}
      title="Pin lưu trữ Hithium"
      description="Pin lưu trữ Hithium điện áp thấp, phù hợp cho hệ thống điện mặt trời dân dụng."
    />
  );
}
