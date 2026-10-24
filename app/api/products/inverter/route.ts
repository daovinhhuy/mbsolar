import { getDatabaseConnection } from "@/app/api/connectionDB";

export const runtime = "nodejs";

type InverterProductRow = {
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

export async function GET(request: Request) {
  const pool = getDatabaseConnection();

  if (!pool) {
    return Response.json(
      { error: "Database is not configured." },
      { status: 503 },
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const brandKey = searchParams.get("brand")?.toLowerCase();
  const phase = searchParams.get("phase");
  const voltage = searchParams.get("voltage");
  const brandPatterns: Record<string, string> = {
    solax: "solax%",
    solis: "solis%",
    sungrow: "sungrow%",
  };

  if (brandKey && !brandPatterns[brandKey]) {
    return Response.json({ error: "Unsupported inverter brand." }, { status: 400 });
  }

  if (phase && phase !== "1" && phase !== "3") {
    return Response.json({ error: "Unsupported inverter phase." }, { status: 400 });
  }

  if (voltage && voltage !== "high") {
    return Response.json({ error: "Unsupported inverter voltage." }, { status: 400 });
  }

  try {
    const { rows } = await pool.query<InverterProductRow>(`
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
      WHERE (
        c.slug ILIKE '%inverter%'
        OR c.name ILIKE '%inverter%'
        OR parent_category.slug ILIKE '%inverter%'
        OR parent_category.name ILIKE '%inverter%'
      )
        AND ($1::TEXT IS NULL OR LOWER(b.name) LIKE $1)
         AND (
           $2::TEXT IS NULL
           OR ($2 = '1' AND (
             c.slug ILIKE '%1-phase%'
             OR c.name ILIKE '%1 pha%'
             OR c.name ILIKE '%1 phase%'
           ))
           OR ($2 = '3' AND (
             c.slug ILIKE '%3-phase%'
             OR c.name ILIKE '%3 pha%'
             OR c.name ILIKE '%3 phase%'
           ))
         )
        AND ($3::TEXT IS NULL OR (
          c.slug ILIKE '%high-voltage%'
          OR c.name ILIKE '%áp cao%'
        ))
      ORDER BY c.sort_order, p.sort_order, p.name;
    `, [brandKey ? brandPatterns[brandKey] : null, phase, voltage]);

    return Response.json({ products: rows });
  } catch (error) {
    console.error("Failed to load inverter products:", error);
    return Response.json(
      { error: "Unable to load inverter products from the database." },
      { status: 500 },
    );
  }
}
