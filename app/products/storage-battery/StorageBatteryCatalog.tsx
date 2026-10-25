"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCatalog from "@/component/ProductCatalog";
import { useGlobalLoading } from "@/component/GlobalLoading";
import type {
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/data/products";

type StorageBatteryProductResponse = {
  id: string;
  slug: string;
  name: string;
  model_number: string | null;
  description: string;
  badge: string | null;
  images: string[];
  brand_name: string;
  category_slug: string;
  category_name: string;
  category_filter_key: string | null;
};

type StorageBatteryCatalogProps = {
  initialFilter?: string;
};

export default function StorageBatteryCatalog({
  initialFilter,
}: StorageBatteryCatalogProps) {
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { runWithGlobalLoading } = useGlobalLoading();

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await runWithGlobalLoading(() =>
          fetch("/api/products/storage-battery", {
            signal: controller.signal,
          }),
        );

        if (!response.ok) {
          throw new Error("Không thể tải danh sách pin lưu trữ.");
        }

        const data = (await response.json()) as {
          products: StorageBatteryProductResponse[];
        };

        setProducts(
          data.products.map((product) => ({
            name: product.name,
            category: product.category_name,
            brand: product.brand_name,
            badge: product.badge ?? undefined,
            description: product.description,
            image: product.images[0],
            images: product.images,
            slug: product.slug,
            filterKey: product.category_slug,
          })),
        );
      } catch {
        if (!controller.signal.aborted) {
          setError("Không thể tải danh sách pin lưu trữ. Vui lòng thử tải lại trang.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, [runWithGlobalLoading]);

  const filters = useMemo<ProductCatalogFilter[]>(() => {
    const categories = new Map<string, string>();

    for (const product of products) {
      categories.set(product.filterKey, product.category);
    }

    return [
      { key: "all", label: "Tất cả sản phẩm" },
      ...Array.from(categories, ([key, label]) => ({ key, label })),
    ];
  }, [products]);

  const resolvedInitialFilter = filters.some(
    (filter) => filter.key === initialFilter,
  )
    ? initialFilter
    : filters.find((filter) =>
        products.some(
          (product) =>
            product.filterKey === filter.key &&
            (product.filterKey === initialFilter ||
              product.category.toLowerCase() === initialFilter?.toLowerCase()),
        ),
      )?.key;

  return (
    <>
      {error ? (
        <p className="catalog-empty-state" role="alert">
          {error}
        </p>
      ) : loading ? null : products.length === 0 ? (
        <p className="catalog-empty-state" role="status">
          Chưa có sản phẩm pin lưu trữ.
        </p>
      ) : (
        <ProductCatalog
          eyebrow="PIN LƯU TRỮ NĂNG LƯỢNG"
          title="Pin lưu trữ năng lượng"
          description="Lưu trữ nguồn điện sạch để sử dụng linh hoạt, ổn định và tiết kiệm hơn."
          filters={filters}
          products={products}
          initialFilter={resolvedInitialFilter}
          filterPath="/products/storage-battery"
        />
      )}
    </>
  );
}
