import type { Metadata } from "next";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ProductCatalog from "@/component/ProductCatalog";
import { getAccessoryCatalog } from "@/services/accessoryCatalog";

export const metadata: Metadata = {
  title: "Tủ điện Hybrid | MB Solar",
};

export default async function HybridCabinetAccessoriesPage() {
  const catalog = await getAccessoryCatalog();

  return (
    <>
      <Header />
      <main>
        <ProductCatalog
          eyebrow="PHỤ KIỆN NĂNG LƯỢNG MẶT TRỜI"
          title="Tủ điện Hybrid"
          description="Tủ điện bảo vệ và kết nối đồng bộ cho hệ thống điện mặt trời hybrid."
          filters={catalog.filters}
          products={catalog.products}
          showFilters={false}
          initialFilter="tu-dien-hybrid"
        />
      </main>
      <Footer />
    </>
  );
}
