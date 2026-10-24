import { headers } from "next/headers";
import type {
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/data/products";

export type StorageBatteryCatalogOptions = {
  categorySlug?: string;
};

type ApiProduct = {
  slug: string;
  name: string;
  description: string;
  badge: string | null;
  images: string[];
  brand_name: string;
  category_slug: string;
  category_name: string;
};

export type StorageBatteryCatalog = {
  filters: ProductCatalogFilter[];
  products: ProductCatalogItem[];
};

export async function getStorageBatteryCatalog(
  options: StorageBatteryCatalogOptions = {},
): Promise<StorageBatteryCatalog> {
  const emptyCatalog = {
    filters: [{ key: "all", label: "Tất cả sản phẩm" }],
    products: [],
  };
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    requestHeaders.get("host");

  if (!host) return emptyCatalog;

  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const isLocalHost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");
  const protocol =
    forwardedProtocol ??
    (process.env.NODE_ENV === "development" || isLocalHost ? "http" : "https");
  const searchParams = new URLSearchParams();

  if (options.categorySlug) {
    searchParams.set("category", options.categorySlug);
  }

  const serializedSearchParams = searchParams.toString();
  const query = serializedSearchParams ? `?${serializedSearchParams}` : "";

  try {
    const response = await fetch(
      `${protocol}://${host}/api/products/storage-battery${query}`,
      { cache: "no-store" },
    );

    if (!response.ok) return emptyCatalog;

    const data = (await response.json()) as { products: ApiProduct[] };
    const categoryFilters = new Map<string, string>();
    const products = data.products.map((product) => {
      categoryFilters.set(product.category_slug, product.category_name);

      return {
        slug: product.slug,
        name: product.name,
        category: product.category_name,
        brand: product.brand_name,
        badge: product.badge ?? undefined,
        description: product.description,
        image: product.images[0],
        images: product.images,
        filterKey: product.category_slug,
      };
    });

    return {
      filters: [
        { key: "all", label: "Tất cả sản phẩm" },
        ...Array.from(categoryFilters, ([key, label]) => ({ key, label })),
      ],
      products,
    };
  } catch (error) {
    console.error("Failed to fetch storage battery products from API:", error);
    return emptyCatalog;
  }
}
