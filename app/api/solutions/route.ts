import { getDatabaseConnection } from "@/app/api/connectionDB";

export const runtime = "nodejs";

type SolutionRow = {
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
    const { rows } = await pool.query<SolutionRow>(`
      SELECT
        s.id,
        s.title,
        s.introduction,
        s.content,
        COALESCE(
          (
            SELECT json_agg(i.path ORDER BY si.is_primary DESC, si.sort_order, i.id)
            FROM solution_images AS si
            JOIN images AS i ON i.id = si.image_id
            WHERE si.solution_id = s.id
          ),
          '[]'::JSON
        ) AS images
      FROM solutions AS s
      WHERE s.is_published = TRUE
      ORDER BY s.sort_order, s.id;
    `);

    return Response.json({ solutions: rows });
  } catch (error) {
    console.error("Failed to load solutions:", error);
    return Response.json(
      { error: "Unable to load solutions from the database." },
      { status: 500 },
    );
  }
}
