import { getDatabaseConnection } from "@/app/api/connectionDB";

export const runtime = "nodejs";

type HomepageProductRow = {
  slug: string;
  name: string;
  category_name: string;
  brand_name: string;
  description: string;
  badge: string | null;
  images: string[];
};

const productSelection = `
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
`;

export async function GET() {
  const pool = getDatabaseConnection();

  if (!pool) {
    return Response.json(
      { error: "Database is not configured." },
      { status: 503 },
    );
  }

  try {
    const [newProducts, bestSellingProducts] = await Promise.all([
      pool.query<HomepageProductRow>(`
        ${productSelection}
          AND (p.is_new = TRUE OR NOT EXISTS (
            SELECT 1 FROM products WHERE is_active = TRUE AND is_new = TRUE
          ))
        ORDER BY p.created_at DESC, p.sort_order, p.name;
      `),
      pool.query<HomepageProductRow>(`
        ${productSelection}
          AND p.is_best_seller = TRUE
        ORDER BY p.sort_order, p.name;
      `),
    ]);

    return Response.json({
      newProducts: newProducts.rows,
      bestSellingProducts: bestSellingProducts.rows,
    });
  } catch (error) {
    console.error("Failed to load homepage products:", error);
    return Response.json(
      { error: "Unable to load homepage products from the database." },
      { status: 500 },
    );
  }
}
