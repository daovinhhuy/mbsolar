export type Product = {
  name: string;
  category: string;
  brand: string;
  badge?: string;
  description: string;
  image?: string;
  images?: string[];
  slug?: string;
};

export type ProductCatalogItem = Product & { filterKey: string };
export type ProductCatalogFilter = { key: string; label: string };

export const productSlug = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
