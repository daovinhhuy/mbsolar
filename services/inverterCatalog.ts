import { headers } from "next/headers";
import type {
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/data/products";

export type InverterBrand = "solax" | "solis" | "sungrow";

export type InverterCatalogOptions = {
  brand?: InverterBrand;
  phase?: "1" | "3";
  voltage?: "high";
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

export type InverterCatalog = {
  filters: ProductCatalogFilter[];
  products: ProductCatalogItem[];
};

export async function getInverterCatalog(
  options: InverterCatalogOptions = {},
): Promise<InverterCatalog> {
  const emptyCatalog = {
    filters: [{ key: "all", label: "Tất cả sản phẩm" }],
    products: [],
  };
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    requestHeaders.get("host");

  if (!host) {
    return emptyCatalog;
  }

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

  if (options.brand) searchParams.set("brand", options.brand);
  if (options.phase) searchParams.set("phase", options.phase);
  if (options.voltage) searchParams.set("voltage", options.voltage);

  const serializedSearchParams = searchParams.toString();
  const query = serializedSearchParams ? `?${serializedSearchParams}` : "";

  try {
    const response = await fetch(
      `${protocol}://${host}/api/products/inverter${query}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return emptyCatalog;
    }

    const data = (await response.json()) as { products: ApiProduct[] };
    const categoryFilters = new Map<string, string>();
    const products = data.products.map((product) => {
      const categoryLabel = product.category_name
        .replace(/\bSolaX\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      categoryFilters.set(product.category_slug, categoryLabel);

      return {
        slug: product.slug,
        name: product.name,
        category: categoryLabel,
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
    console.error("Failed to fetch inverter products from API:", error);
    return emptyCatalog;
  }
}
