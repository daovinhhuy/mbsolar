import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getDatabaseConnection } from "@/app/api/connectionDB";
import PartnerPage from "@/component/PartnerPage";
import type { Product } from "@/data/products";
import { getPartnerById, getPartnerRouteKey } from "@/services/partners";

type PartnerRouteProps = {
  params: Promise<{ id: string }>;
};

type PartnerProductRow = {
  slug: string;
  name: string;
  category_name: string;
  brand_name: string;
  description: string;
  badge: string | null;
  images: string[];
};

async function getPartnerProducts(brandName: string): Promise<Product[]> {
  const pool = getDatabaseConnection();
  if (!pool) return [];

  try {
    const { rows } = await pool.query<PartnerProductRow>(
      `
        SELECT
          p.slug,
          p.name,
          c.name AS category_name,
          b.name AS brand_name,
          p.description,
          p.badge,
          COALESCE(
            (
              SELECT json_agg(i.path ORDER BY pi.is_primary DESC, pi.sort_order, i.id)
              FROM product_images AS pi
              JOIN images AS i ON i.id = pi.image_id
              WHERE pi.product_id = p.id
            ),
            '[]'::JSON
          ) AS images
        FROM products AS p
        JOIN brands AS b ON b.id = p.brand_id
        JOIN categories AS c ON c.id = p.category_id
        WHERE p.is_active = TRUE
          AND b.is_active = TRUE
          AND c.is_active = TRUE
          AND (
            LOWER(b.name) = LOWER($1)
            OR (
              LOWER($1) = 'leader'
              AND p.slug IN ('day-cap-black', 'day-cap-red')
            )
          )
        ORDER BY c.sort_order, p.sort_order, p.name;
      `,
      [brandName],
    );

    return rows.map((product) => ({
      slug: product.slug,
      name: product.name,
      category: product.category_name,
      brand: brandName.toLowerCase() === "leader" ? brandName : product.brand_name,
      description: product.description,
      badge: product.badge ?? undefined,
      images: product.images,
      image: product.images[0],
    }));
  } catch (error) {
    console.error("Failed to load partner products from database:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PartnerRouteProps): Promise<Metadata> {
  const { id } = await params;
  const partnerId = Number(id.split("-", 1)[0]);
  const partner = await getPartnerById(partnerId);

  return {
    title: partner ? `Đối tác ${partner.name} | MB Solar` : "Đối tác công nghệ | MB Solar",
    description: partner?.description,
  };
}

export default async function PartnerRoute({ params }: PartnerRouteProps) {
  const { id } = await params;
  const partnerId = Number(id.split("-", 1)[0]);
  const partner = await getPartnerById(partnerId);

  if (!partner) notFound();
  if (id !== getPartnerRouteKey(partner)) redirect(`/partner/${getPartnerRouteKey(partner)}`);

  const products = await getPartnerProducts(partner.name);
  return <PartnerPage partner={{ ...partner, products }} />;
}
