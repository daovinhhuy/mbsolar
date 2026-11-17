import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ SUNGROW | MB Solar",
};

export default function SungrowStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categoryName={"Pin l\u01b0u tr\u1eef Sungrow \u0111i\u1ec7n \u00e1p th\u1ea5p"}
      title="Pin Lưu trữ SUNGROW"
      description="Pin lưu trữ SUNGROW cho hệ thống điện mặt trời dân dụng và thương mại."
    />
  );
}
