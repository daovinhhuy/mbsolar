import type { Pool, PoolClient } from "pg";
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
};

export function isContentResource(value: string): value is ContentResource {
  return value in resourceConfig;
}

export function parseContentDraft(value: unknown): ContentDraft {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AdminValidationError("Dữ liệu gửi lên không hợp lệ.");
  }

  const body = value as Record<string, unknown>;
  const draft = {
    title: parseRequiredText(body.title, "Tiêu đề"),
    introduction: parseRequiredText(body.introduction, "Giới thiệu"),
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
    const result = id
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
