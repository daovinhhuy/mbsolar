import { getDatabaseConnection } from "@/app/api/connectionDB";

export const runtime = "nodejs";

type SolutionRow = {
  id: string;
  title: string;
  introduction: string;
  content: string;
  legacy_images: string[];
  image_1: string | null;
  content_1: string | null;
  image_2: string | null;
  content_2: string | null;
  image_3: string | null;
  content_3: string | null;
  image_4: string | null;
  content_4: string | null;
  image_5: string | null;
  content_5: string | null;
  image_6: string | null;
  content_6: string | null;
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
        ARRAY(
          SELECT image.path
          FROM solution_images AS relation
          JOIN images AS image ON image.id = relation.image_id
          WHERE relation.solution_id = s.id
          ORDER BY relation.is_primary DESC, relation.sort_order, image.id
          LIMIT 6
        ) AS legacy_images,
        s.image_1,
        s.content_1,
        s.image_2,
        s.content_2,
        s.image_3,
        s.content_3,
        s.image_4,
        s.content_4,
        s.image_5,
        s.content_5,
        s.image_6,
        s.content_6
      FROM solutions AS s
      WHERE s.is_published = TRUE
      ORDER BY s.sort_order, s.id;
    `);

    const solutions = rows.map((row) => {
      let sections = [
        { image: row.image_1, content: row.content_1 },
        { image: row.image_2, content: row.content_2 },
        { image: row.image_3, content: row.content_3 },
        { image: row.image_4, content: row.content_4 },
        { image: row.image_5, content: row.content_5 },
        { image: row.image_6, content: row.content_6 },
      ];
      if (!sections.some((section) => section.image || section.content)) {
        const paragraphs = row.content
          .split(/\r?\n\s*\r?\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean);
        sections = Array.from({ length: Math.min(6, Math.max(paragraphs.length, row.legacy_images.length)) }, (_, index) => ({
          image: row.legacy_images[index] ?? null,
          content: paragraphs[index] ?? null,
        }));
      }
      return {
        id: row.id,
        title: row.title,
        introduction: row.introduction,
        sections,
      };
    });

    return Response.json({ solutions });
  } catch (error) {
    console.error("Failed to load solutions:", error);
    return Response.json(
      { error: "Unable to load solutions from the database." },
      { status: 500 },
    );
  }
}
