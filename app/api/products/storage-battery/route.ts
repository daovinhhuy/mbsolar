import { getDatabaseConnection } from "@/app/api/connectionDB";

export const runtime = "nodejs";

type StorageBatteryProductRow = {
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
};

export async function GET(request: Request) {
  const pool = getDatabaseConnection();

  if (!pool) {
    return Response.json(
      { error: "Database is not configured." },
      { status: 503 },
    );
  }

  const categoryName = new URL(request.url).searchParams.get("category");

  try {
    const { rows } = await pool.query<StorageBatteryProductRow>(`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.model_number,
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
        ) AS images,
        b.name AS brand_name,
        c.slug AS category_slug,
        c.name AS category_name
      FROM products AS p
      JOIN brands AS b ON b.id = p.brand_id
      JOIN categories AS c ON c.id = p.category_id
      LEFT JOIN categories AS parent_category ON parent_category.id = c.parent_id
      WHERE p.is_active = TRUE
        AND c.is_active = TRUE
        AND b.is_active = TRUE
        AND (
          ($1::TEXT IS NULL AND c.category_group = 'storage_battery')
          OR (
            $1::TEXT IS NOT NULL
            AND c.name = $1
            AND c.category_group IN ('storage_battery', 'commercial_industrial')
          )
        )
      ORDER BY c.sort_order, p.sort_order, p.name;
    `, [categoryName]);

    return Response.json({ products: rows });
  } catch (error) {
    console.error("Failed to load storage battery products:", error);
    return Response.json(
      { error: "Unable to load storage battery products from the database." },
      { status: 500 },
    );
  }
}
