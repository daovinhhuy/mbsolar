import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ProductCatalog from "@/component/ProductCatalog";
import {
  getInverterCatalog,
  type InverterBrand,
} from "@/services/inverterCatalog";

type InverterSubcategoryPageProps = {
  brand: InverterBrand;
  phase: "1" | "3";
  voltage?: "high";
  title: string;
  description: string;
};

export default async function InverterSubcategoryPage({
  brand,
  phase,
  voltage,
  title,
  description,
}: InverterSubcategoryPageProps) {
  const catalog = await getInverterCatalog({ brand, phase, voltage });

  return (
    <>
      <Header />
      <main>
        <ProductCatalog
          eyebrow="INVERTER"
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
