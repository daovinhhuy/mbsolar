import { getDatabaseConnection } from "@/app/api/connectionDB";

export const runtime = "nodejs";

type ConstructionProjectRow = {
  id: string;
  title: string;
  introduction: string;
  content: string;
  images: string[];
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
    const { rows } = await pool.query<ConstructionProjectRow>(`
      SELECT
        p.id,
        p.title,
        p.introduction,
        p.content,
        COALESCE(
          (
            SELECT json_agg(i.path ORDER BY cpi.is_primary DESC, cpi.sort_order, i.id)
            FROM construction_project_images AS cpi
            JOIN images AS i ON i.id = cpi.image_id
            WHERE cpi.project_id = p.id
          ),
          '[]'::JSON
        ) AS images
      FROM construction_projects AS p
      WHERE p.is_published = TRUE
      ORDER BY p.sort_order, p.id;
    `);

    return Response.json({ projects: rows });
  } catch (error) {
    console.error("Failed to load construction projects:", error);
    return Response.json(
      { error: "Unable to load construction projects from the database." },
      { status: 500 },
    );
  }
}
