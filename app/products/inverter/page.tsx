import type { Metadata } from "next";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ProductCatalog from "@/component/ProductCatalog";
import { getInverterCatalog } from "@/services/inverterCatalog";

export const metadata: Metadata = {
  title: "Inverter | MB Solar",
};

export default async function InverterPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const { filter } = await searchParams;
  const catalog = await getInverterCatalog();

  return (
    <>
      <Header />
      <main>
        <ProductCatalog
          eyebrow="DANH MỤC INVERTER"
          title="Inverter"
          description="Khám phá các sản phẩm inverter và lọc theo danh mục phù hợp với hệ thống của bạn."
          filters={catalog.filters}
          products={catalog.products}
          initialFilter={typeof filter === "string" ? filter : undefined}
          filterPath="/products/inverter"
        />
      </main>
      <Footer />
    </>
  );
}
