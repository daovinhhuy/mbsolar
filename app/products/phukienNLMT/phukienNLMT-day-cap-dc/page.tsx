import type { Metadata } from "next";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ProductCatalog from "@/component/ProductCatalog";
import { getAccessoryCatalog } from "@/services/accessoryCatalog";

export const metadata: Metadata = {
  title: "Dây cáp DC Leader | MB Solar",
};

export default async function DcCableAccessoriesPage() {
  const catalog = await getAccessoryCatalog();

  return (
    <>
      <Header />
      <main>
        <ProductCatalog
          eyebrow="PHỤ KIỆN NĂNG LƯỢNG MẶT TRỜI"
          title="Dây cáp DC Leader"
          description="Dây cáp DC chuyên dụng, bền bỉ cho hệ thống điện mặt trời."
          filters={catalog.filters}
          products={catalog.products}
          showFilters={false}
          initialFilter="day-dien-dc"
        />
      </main>
      <Footer />
    </>
  );
}
