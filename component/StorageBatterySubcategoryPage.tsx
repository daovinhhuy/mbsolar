import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ProductCatalog from "@/component/ProductCatalog";
import { getStorageBatteryCatalog } from "@/services/storageBatteryCatalog";

type StorageBatterySubcategoryPageProps = {
  categorySlug: string;
  title: string;
  description: string;
};

export default async function StorageBatterySubcategoryPage({
  categorySlug,
  title,
  description,
}: StorageBatterySubcategoryPageProps) {
  const catalog = await getStorageBatteryCatalog({ categorySlug });

  return (
    <>
      <Header />
      <main>
        <ProductCatalog
          eyebrow="PIN LƯU TRỮ NĂNG LƯỢNG"
          title={title}
          description={description}
          filters={catalog.filters}
          products={catalog.products}
          showFilters={false}
        />
      </main>
      <Footer />
    </>
  );
}
