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
  badge: string | null;
};

export type SolarPanelCatalog = {
  filters: ProductCatalogFilter[];
  products: ProductCatalogItem[];
};

function brandFilterKey(brand: string) {
  return brand
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getSolarPanelCatalog(): Promise<SolarPanelCatalog> {
  const emptyCatalog: SolarPanelCatalog = {
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

  try {
    const response = await fetch(`${protocol}://${host}/api/products/solar-panels`, {
      cache: "no-store",
    });

    if (!response.ok) return emptyCatalog;

    const data = (await response.json()) as { products: ApiProduct[] };
    const brands = new Map<string, string>();
    const products = data.products.map((product) => {
      const filterKey = brandFilterKey(product.brand_name);
      brands.set(filterKey, product.brand_name);

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
        { key: "all", label: "Tất cả sản phẩm" },
        ...Array.from(brands, ([key, label]) => ({ key, label })),
      ],
      products,
    };
  } catch (error) {
    console.error("Failed to fetch solar panels from API:", error);
    return emptyCatalog;
  }
}
