import type { Metadata } from "next";
import StorageBatterySubcategoryPage from "@/component/StorageBatterySubcategoryPage";

export const metadata: Metadata = {
  title: "Pin lưu trữ Dyness | MB Solar",
};

export default function DynessStorageBatteryPage() {
  return (
    <StorageBatterySubcategoryPage
      categoryName={"Pin l\u01b0u tr\u1eef Dyness \u0111i\u1ec7n \u00e1p th\u1ea5p"}
      title="Pin lưu trữ Dyness"
      description="Pin lưu trữ Dyness dạng tháp, linh hoạt cho nhiều quy mô hệ thống."
    />
  );
}
