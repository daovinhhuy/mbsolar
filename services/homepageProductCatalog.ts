import { headers } from "next/headers";
import type { Product } from "@/data/products";

type ApiProduct = {
  slug: string;
  name: string;
  category_name: string;
  brand_name: string;
  description: string;
  badge: string | null;
  images: string[];
};

export type HomepageProductCatalog = {
  newProducts: Product[];
  bestSellingProducts: Product[];
};

const emptyCatalog: HomepageProductCatalog = {
  newProducts: [],
  bestSellingProducts: [],
};

function toProduct(product: ApiProduct): Product {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category_name,
    brand: product.brand_name,
    description: product.description,
    badge: product.badge ?? undefined,
    images: product.images,
    image: product.images[0],
  };
}

export async function getHomepageProductCatalog(): Promise<HomepageProductCatalog> {
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
    const response = await fetch(`${protocol}://${host}/api/products/homepage`, {
      cache: "no-store",
    });

    if (!response.ok) return emptyCatalog;

    const data = (await response.json()) as {
      newProducts: ApiProduct[];
      bestSellingProducts: ApiProduct[];
    };

    return {
      newProducts: data.newProducts.map(toProduct),
      bestSellingProducts: data.bestSellingProducts.map(toProduct),
    };
  } catch (error) {
    console.error("Failed to load homepage product sections:", error);
    return emptyCatalog;
  }
}
