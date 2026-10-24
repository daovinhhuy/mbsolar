import { headers } from "next/headers";
import type {
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/data/products";

type ApiProduct = {
  slug: string;
  name: string;
  description: string;
  images: string[];
  brand_name: string;
  category_slug: string;
  category_name: string;
  category_filter_key: string | null;
  badge: string | null;
};

export type AccessoryCatalog = {
  filters: ProductCatalogFilter[];
  products: ProductCatalogItem[];
};

export async function getAccessoryCatalog(): Promise<AccessoryCatalog> {
  const emptyCatalog: AccessoryCatalog = {
    filters: [{ key: "all", label: "Tất cả phụ kiện" }],
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

  try {
    const response = await fetch(`${protocol}://${host}/api/products/accessories`, {
      cache: "no-store",
    });

    if (!response.ok) return emptyCatalog;

    const data = (await response.json()) as { products: ApiProduct[] };
    const categories = new Map<string, string>();
    const products = data.products.map((product) => {
      const filterKey = product.category_filter_key ?? product.category_slug;
      categories.set(filterKey, product.category_name);

      return {
        slug: product.slug,
        name: product.name,
        category: product.category_name,
        brand: product.brand_name,
        badge: product.badge ?? undefined,
        description: product.description,
        image: product.images[0],
        images: product.images,
        filterKey,
      };
    });

    return {
      filters: [
        { key: "all", label: "Tất cả phụ kiện" },
        ...Array.from(categories, ([key, label]) => ({ key, label })),
      ],
      products,
    };
  } catch (error) {
    console.error("Failed to fetch accessory products from API:", error);
    return emptyCatalog;
  }
}
