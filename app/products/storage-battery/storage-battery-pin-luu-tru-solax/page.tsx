import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ SolaX | MB Solar",
};

export default function SolaxStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categoryName={"Pin l\u01b0u tr\u1eef SolaX \u0111i\u1ec7n \u00e1p th\u1ea5p"}
      title="Pin lưu trữ SolaX"
      description="Pin lưu trữ SolaX dạng mô-đun, dễ mở rộng cho nhu cầu điện gia đình."
    />
  );
}
