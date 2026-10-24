import { getDatabaseConnection } from "@/app/api/connectionDB";

export const runtime = "nodejs";

type SolarPanelRow = {
  id: string;
  slug: string;
  name: string;
  model_number: string | null;
  description: string;
  specifications: Record<string, unknown>;
  badge: string | null;
  images: string[];
  brand_name: string;
  category_slug: string;
  category_name: string;
};

export async function GET() {
  const pool = getDatabaseConnection();

  if (!pool) {
    return Response.json(
      { error: "Database is not configured." },
      { status: 503 },
    );
  }

  try {
    const { rows } = await pool.query<SolarPanelRow>(`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.model_number,
        p.description,
        p.specifications,
        p.badge,
        COALESCE(
          (
            SELECT json_agg(i.path ORDER BY pi.is_primary DESC, pi.sort_order, i.id)
            FROM product_images AS pi
            JOIN images AS i ON i.id = pi.image_id
            WHERE pi.product_id = p.id
          ),
          '[]'::JSON
        ) AS images,
        b.name AS brand_name,
        c.slug AS category_slug,
        c.name AS category_name
      FROM products AS p
      JOIN brands AS b ON b.id = p.brand_id
      JOIN categories AS c ON c.id = p.category_id
      LEFT JOIN categories AS parent_category ON parent_category.id = c.parent_id
      WHERE p.is_active = TRUE
        AND b.is_active = TRUE
        AND c.is_active = TRUE
        AND (
          c.slug ILIKE 'tam-pin-%'
          OR parent_category.slug ILIKE 'tam-pin-%'
        )
      ORDER BY c.sort_order, p.sort_order, p.name;
    `);

    return Response.json({ products: rows });
  } catch (error) {
    console.error("Failed to load solar panel products:", error);
    return Response.json(
      { error: "Unable to load solar panel products from the database." },
      { status: 500 },
    );
  }
}
