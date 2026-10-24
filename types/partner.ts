import type { Product } from "@/data/products";

export type Partner = {
  id: number;
  name: string;
  logo: string;
  image: string;
  website: string | null;
  description: string;
  introTitle: string;
  introText: string;
  products?: Product[];
};

export type PartnerRow = Omit<Partner, "products">;
