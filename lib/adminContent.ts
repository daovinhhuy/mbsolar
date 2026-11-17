import type { Pool, PoolClient, QueryResult } from "pg";
import {
  AdminValidationError,
  normalizeImagePaths,
  parseBoolean,
  parseSortOrder,
  parseRequiredText,
} from "@/lib/adminApi";

export type ContentResource = "solutions" | "construction-projects";

const resourceConfig: Record<
  ContentResource,
  { table: string; imageTable: string; foreignKey: string }
> = {
  solutions: {
    table: "solutions",
    imageTable: "solution_images",
    foreignKey: "solution_id",
  },
  "construction-projects": {
    table: "construction_projects",
    imageTable: "construction_project_images",
    foreignKey: "project_id",
  },
};

export type ContentDraft = {
  title: string;
  introduction: string;
  content: string;
  sortOrder: number;
  isPublished: boolean;
  images: string[];
  sections?: { image: string; content: string }[];
};

export function isContentResource(value: string): value is ContentResource {
  return value in resourceConfig;
}

export function parseContentDraft(value: unknown, resource: ContentResource): ContentDraft {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AdminValidationError("Dữ liệu gửi lên không hợp lệ.");
  }

  const body = value as Record<string, unknown>;
  const title = parseRequiredText(body.title, "Tiêu đề");
  const introduction = parseRequiredText(body.introduction, "Giới thiệu");
  const sortOrder = parseSortOrder(body.sortOrder);
  const isPublished = parseBoolean(body.isPublished, true);

  if (resource === "solutions") {
    const rawSections = Array.isArray(body.sections)
      ? body.sections
      : (() => {
          const paragraphs = typeof body.content === "string"
            ? body.content.split(/\r?\n\s*\r?\n/).map((part) => part.trim()).filter(Boolean)
            : [];
          const images = normalizeImagePaths(body.images ?? []);
          return Array.from({ length: Math.max(paragraphs.length, images.length) }, (_, index) => ({
            image: images[index] ?? "",
            content: paragraphs[index] ?? "",
          }));
        })();

    if (rawSections.length > 6) {
      throw new AdminValidationError("Mỗi giải pháp hỗ trợ tối đa 6 cặp hình và nội dung.");
    }

    const sections = rawSections.map((rawSection) => {
      if (typeof rawSection !== "object" || rawSection === null || Array.isArray(rawSection)) {
        throw new AdminValidationError("Cặp hình và nội dung không hợp lệ.");
      }
      const section = rawSection as Record<string, unknown>;
      const imageValue = typeof section.image === "string" ? section.image.trim() : "";
      const image = imageValue ? normalizeImagePaths([imageValue])[0] ?? "" : "";
      const content = typeof section.content === "string" ? section.content.trim() : "";
      if (content.length > 50000) {
        throw new AdminValidationError("Nội dung vượt quá giới hạn cho phép.");
      }
      return { image, content };
    });
    const content = sections.map((section) => section.content).filter(Boolean).join("\n\n");
    const images = sections.map((section) => section.image).filter(Boolean);

    if (!content) {
      throw new AdminValidationError("Vui lòng nhập nội dung cho ít nhất một cặp.");
    }
    if (content.length > 50000) {
      throw new AdminValidationError("Nội dung vượt quá giới hạn cho phép.");
    }
    if (title.length > 300 || introduction.length > 3000) {
      throw new AdminValidationError("Nội dung vượt quá giới hạn cho phép.");
    }

    return { title, introduction, content, sortOrder, isPublished, images, sections };
  }

  const draft = {
    title,
    introduction,
    content: parseRequiredText(body.content, "Nội dung"),
    sortOrder: parseSortOrder(body.sortOrder),
    isPublished: parseBoolean(body.isPublished, true),
    images: normalizeImagePaths(body.images ?? []),
  };

  if (
    draft.title.length > 300 ||
    draft.introduction.length > 3000 ||
    draft.content.length > 50000
  ) {
    throw new AdminValidationError("Nội dung vượt quá giới hạn cho phép.");
  }

  return draft;
}

export async function listContent(pool: Pool, resource: ContentResource) {
  const config = resourceConfig[resource];

  if (resource === "solutions") {
    const { rows } = await pool.query(`
      SELECT
        item.id::TEXT AS id,
        item.title,
        item.introduction,
        item.content,
        item.sort_order AS "sortOrder",
        item.is_published AS "isPublished",
        item.image_1, item.content_1,
        item.image_2, item.content_2,
        item.image_3, item.content_3,
        item.image_4, item.content_4,
        item.image_5, item.content_5,
        item.image_6, item.content_6,
        COALESCE(
          (
            SELECT json_agg(image.path ORDER BY relation.is_primary DESC, relation.sort_order, image.id)
            FROM solution_images AS relation
            JOIN images AS image ON image.id = relation.image_id
            WHERE relation.solution_id = item.id
          ),
          '[]'::JSON
        ) AS "legacyImages"
      FROM solutions AS item
      ORDER BY item.sort_order, item.id;
    `);

    return rows.map((row) => {
      let sections = Array.from({ length: 6 }, (_, index) => ({
        image: row[`image_${index + 1}`] as string | null,
        content: row[`content_${index + 1}`] as string | null,
      }));
      if (!sections.some((section) => section.image || section.content)) {
        const paragraphs = String(row.content ?? "")
          .split(/\r?\n\s*\r?\n/)
          .map((part) => part.trim())
          .filter(Boolean);
        const images = (row.legacyImages ?? []) as string[];
        sections = Array.from({ length: Math.min(6, Math.max(paragraphs.length, images.length)) }, (_, index) => ({
          image: images[index] ?? null,
          content: paragraphs[index] ?? null,
        }));
      }
      return {
        id: row.id,
        title: row.title,
        introduction: row.introduction,
        content: sections.map((section) => section.content).filter(Boolean).join("\n\n"),
        sortOrder: row.sortOrder,
        isPublished: row.isPublished,
        sections,
      };
    });
  }

  const { rows } = await pool.query(`
    SELECT
      item.id::TEXT AS id,
      item.title,
      item.introduction,
      item.content,
      item.sort_order AS "sortOrder",
      item.is_published AS "isPublished",
      COALESCE(
        (
          SELECT json_agg(image.path ORDER BY relation.is_primary DESC, relation.sort_order, image.id)
          FROM ${config.imageTable} AS relation
          JOIN images AS image ON image.id = relation.image_id
          WHERE relation.${config.foreignKey} = item.id
        ),
        '[]'::JSON
      ) AS images
    FROM ${config.table} AS item
    ORDER BY item.sort_order, item.id;
  `);

  return rows;
}

async function replaceContentImages(
  client: PoolClient,
  resource: ContentResource,
  id: string,
  title: string,
  paths: string[],
) {
  const config = resourceConfig[resource];
  await client.query(
    `DELETE FROM ${config.imageTable} WHERE ${config.foreignKey} = $1`,
    [id],
  );

  for (const [sortOrder, path] of paths.entries()) {
    const imageResult = await client.query<{ id: string }>(
      `
        INSERT INTO images (path, alt_text)
        VALUES ($1, $2)
        ON CONFLICT (path) DO UPDATE SET alt_text = COALESCE(images.alt_text, EXCLUDED.alt_text)
        RETURNING id::TEXT AS id;
      `,
      [path, title],
    );
    const imageId = imageResult.rows[0]?.id;
    if (!imageId) throw new Error("Không thể lưu ảnh.");

    await client.query(
      `
        INSERT INTO ${config.imageTable}
          (${config.foreignKey}, image_id, sort_order, is_primary)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (${config.foreignKey}, image_id)
        DO UPDATE SET sort_order = EXCLUDED.sort_order, is_primary = EXCLUDED.is_primary;
      `,
      [id, imageId, sortOrder, sortOrder === 0],
    );
  }
}

export async function saveContent(
  pool: Pool,
  resource: ContentResource,
  draft: ContentDraft,
  id?: string,
) {
  const config = resourceConfig[resource];
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    let result: QueryResult<{ id: string }>;

    if (resource === "solutions") {
      const sections = draft.sections ?? [];
      if (sections.length > 6 || draft.images.length > 6) {
        throw new AdminValidationError("Mỗi giải pháp hỗ trợ tối đa 6 cặp hình và nội dung.");
      }

      const pairColumns = Array.from({ length: 6 }, (_, index) => [
        `image_${index + 1}`,
        `content_${index + 1}`,
      ]).flat();
      const pairValues = Array.from({ length: 6 }, (_, index) => [
        sections[index]?.image || null,
        sections[index]?.content || null,
      ]).flat();
      const baseValues = [draft.title, draft.introduction, draft.content, draft.sortOrder, draft.isPublished];

      result = id
        ? await client.query<{ id: string }>(
            `
              UPDATE solutions
              SET title = $1, introduction = $2, content = $3,
                  sort_order = $4, is_published = $5,
                  ${pairColumns.map((column, index) => `${column} = $${index + 6}`).join(", ")}
              WHERE id = $18
              RETURNING id::TEXT AS id;
            `,
            [...baseValues, ...pairValues, id],
          )
        : await client.query<{ id: string }>(
            `
              INSERT INTO solutions
                (title, introduction, content, sort_order, is_published, ${pairColumns.join(", ")})
              VALUES (${Array.from({ length: 17 }, (_, index) => `$${index + 1}`).join(", ")})
              RETURNING id::TEXT AS id;
            `,
            [...baseValues, ...pairValues],
          );
    } else {
      result = id
      ? await client.query<{ id: string }>(
          `
            UPDATE ${config.table}
            SET title = $1, introduction = $2, content = $3,
                sort_order = $4, is_published = $5
            WHERE id = $6
            RETURNING id::TEXT AS id;
          `,
          [draft.title, draft.introduction, draft.content, draft.sortOrder, draft.isPublished, id],
        )
      : await client.query<{ id: string }>(
          `
            INSERT INTO ${config.table}
              (title, introduction, content, sort_order, is_published)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id::TEXT AS id;
          `,
          [draft.title, draft.introduction, draft.content, draft.sortOrder, draft.isPublished],
        );
    }

    const savedId = result.rows[0]?.id;
    if (!savedId) {
      await client.query("ROLLBACK");
      return null;
    }

    await replaceContentImages(client, resource, savedId, draft.title, draft.images);
    await client.query("COMMIT");
    return savedId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteContent(pool: Pool, resource: ContentResource, id: string) {
  const { table } = resourceConfig[resource];
  const result = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return result.rowCount === 1;
}
