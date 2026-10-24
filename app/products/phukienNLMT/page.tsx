import type { Metadata } from "next";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ProductCatalog from "@/component/ProductCatalog";
import { getAccessoryCatalog } from "@/services/accessoryCatalog";

export const metadata: Metadata = {
  title: "Phụ kiện năng lượng mặt trời | MB Solar",
};

export default async function SolarAccessoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const { filter } = await searchParams;
  const catalog = await getAccessoryCatalog();

  return (
    <>
      <Header />
      <main>
        <ProductCatalog
          eyebrow="PHỤ KIỆN NĂNG LƯỢNG MẶT TRỜI"
          title="Phụ kiện NLMT"
          description="Đầy đủ phụ kiện hỗ trợ lắp đặt, vận hành và mở rộng hệ thống điện mặt trời."
          filters={catalog.filters}
          products={catalog.products}
          initialFilter={typeof filter === "string" ? filter : undefined}
          filterPath="/products/phukienNLMT"
        />
      </main>
      <Footer />
    </>
  );
}
