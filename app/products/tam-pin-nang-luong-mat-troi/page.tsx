import type { Metadata } from "next";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import ProductCatalog from "@/component/ProductCatalog";
import { getSolarPanelCatalog } from "@/services/solarPanelCatalog";

export const metadata: Metadata = {
  title: "Tấm pin năng lượng mặt trời | MB Solar",
};

export default async function SolarPanelPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const [{ filter }, catalog] = await Promise.all([
    searchParams,
    getSolarPanelCatalog(),
  ]);
  const initialFilter =
    typeof filter === "string" && catalog.filters.some((item) => item.key === filter)
      ? filter
      : "all";

  return (
    <>
      <Header />
      <main>
        <ProductCatalog
          eyebrow="TẤM PIN NĂNG LƯỢNG MẶT TRỜI"
          title="Tấm pin năng lượng mặt trời"
          description="Khám phá các dòng tấm pin năng lượng mặt trời phù hợp cho hệ thống của bạn."
          filters={catalog.filters}
          products={catalog.products}
          initialFilter={initialFilter}
          filterPath="/products/tam-pin-nang-luong-mat-troi"
        />
      </main>
      <Footer />
    </>
  );
}
