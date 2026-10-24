import type { Metadata } from "next";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import StorageBatteryCatalog from "@/app/products/storage-battery/StorageBatteryCatalog";

export const metadata: Metadata = {
  title: "Pin lưu trữ năng lượng | MB Solar",
};

export default async function SolarStoragePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const { filter } = await searchParams;

  return (
    <>
      <Header />
      <main>
          <StorageBatteryCatalog
            initialFilter={typeof filter === "string" ? filter : undefined}
          />
      </main>
      <Footer />
    </>
  );
}
