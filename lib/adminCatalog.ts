import type { Pool } from "pg";
import {
  AdminValidationError,
  parseBoolean,
  parseDatabaseId,
  parseRequiredText,
  parseSortOrder,
} from "@/lib/adminApi";

export type AdminCatalogResource = "brands" | "categories";

export type BrandDraft = {
  name: string;
  isActive: boolean;
};

export type CategoryDraft = {
  name: string;
  slug: string;
  parentId: string | null;
  filterKey: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

const SOLAR_PANEL_SLUG_PATTERN = /^tam-pin-[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class AdminCatalogConflictError extends Error {}

export function isAdminCatalogResource(value: string): value is AdminCatalogResource {
  return value === "brands" || value === "categories";
}

function requestBody(value: unknown) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AdminValidationError("Dữ liệu gửi lên không hợp lệ.");
  }
  return value as Record<string, unknown>;
}

function optionalText(value: unknown, label: string, maxLength: number) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    throw new AdminValidationError(`${label} không hợp lệ.`);
  }

  const text = value.trim();
  if (text.length > maxLength) {
    throw new AdminValidationError(`${label} không được dài quá ${maxLength} ký tự.`);
  }
  return text || null;
}

export function parseBrandDraft(value: unknown): BrandDraft {
  const body = requestBody(value);
  const draft = {
    name: parseRequiredText(body.name, "Tên thương hiệu"),
    isActive: parseBoolean(body.isActive, true),
  };

  if (draft.name.length > 200) {
    throw new AdminValidationError("Tên thương hiệu không được dài quá 200 ký tự.");
  }
  return draft;
}

export function parseCategoryDraft(value: unknown): CategoryDraft {
  const body = requestBody(value);
  const slug = parseRequiredText(body.slug, "Đường dẫn danh mục").toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new AdminValidationError("Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang.");
  }

  let parentId: string | null = null;
  if (body.parentId !== undefined && body.parentId !== null && body.parentId !== "") {
    if (typeof body.parentId !== "string" || !parseDatabaseId(body.parentId)) {
      throw new AdminValidationError("Danh mục cha không hợp lệ.");
    }
    parentId = body.parentId;
  }

  const draft = {
    name: parseRequiredText(body.name, "Tên danh mục"),
    slug,
    parentId,
    filterKey: optionalText(body.filterKey, "Khóa lọc", 160),
    description: optionalText(body.description, "Mô tả", 5000),
    sortOrder: parseSortOrder(body.sortOrder),
    isActive: parseBoolean(body.isActive, true),
  };

  if (draft.name.length > 200 || draft.slug.length > 180) {
    throw new AdminValidationError("Tên hoặc đường dẫn danh mục vượt quá giới hạn cho phép.");
  }
  return draft;
}

export async function listAdminCatalog(pool: Pool, resource: AdminCatalogResource) {
  if (resource === "brands") {
    const { rows } = await pool.query(`
      SELECT
        brand.id::TEXT AS id,
        brand.name,
        brand.is_active AS "isActive",
        (SELECT COUNT(*)::INTEGER FROM products WHERE brand_id = brand.id) AS "productCount"
      FROM brands AS brand
      ORDER BY brand.name, brand.id;
    `);
    return { items: rows };
  }

  const [categories, parents] = await Promise.all([
    pool.query(`
      WITH RECURSIVE category_ancestry AS (
        SELECT
          id,
          parent_id,
          slug,
          slug ILIKE 'tam-pin-%' AS is_solar_panel
        FROM categories
        WHERE parent_id IS NULL
        UNION ALL
        SELECT
          child.id,
          child.parent_id,
          child.slug,
          parent.is_solar_panel OR child.slug ILIKE 'tam-pin-%'
        FROM categories AS child
        JOIN category_ancestry AS parent ON parent.id = child.parent_id
      )
      SELECT
        category.id::TEXT AS id,
        category.name,
        category.slug,
        category.parent_id::TEXT AS "parentId",
        parent.name AS "parentName",
        category.filter_key AS "filterKey",
        category.description,
        category.sort_order AS "sortOrder",
        category.is_active AS "isActive",
        COALESCE(category_ancestry.is_solar_panel, FALSE) AS "isSolarPanel",
        (SELECT COUNT(*)::INTEGER FROM products WHERE category_id = category.id) AS "productCount",
        (SELECT COUNT(*)::INTEGER FROM categories AS child WHERE child.parent_id = category.id) AS "childCount"
      FROM categories AS category
      LEFT JOIN categories AS parent ON parent.id = category.parent_id
      LEFT JOIN category_ancestry ON category_ancestry.id = category.id
      ORDER BY parent.sort_order NULLS FIRST, parent.name, category.sort_order, category.name, category.id;
    `),
    pool.query(`
      WITH RECURSIVE category_ancestry AS (
        SELECT
          id,
          parent_id,
          slug,
          slug ILIKE 'tam-pin-%' AS is_solar_panel
        FROM categories
        WHERE parent_id IS NULL
        UNION ALL
        SELECT
          child.id,
          child.parent_id,
          child.slug,
          parent.is_solar_panel OR child.slug ILIKE 'tam-pin-%'
        FROM categories AS child
        JOIN category_ancestry AS parent ON parent.id = child.parent_id
      )
      SELECT
        category.id::TEXT AS id,
        category.name,
        category.parent_id::TEXT AS "parentId",
        COALESCE(category_ancestry.is_solar_panel, FALSE) AS "isSolarPanel"
      FROM categories AS category
      LEFT JOIN category_ancestry ON category_ancestry.id = category.id
      ORDER BY category.sort_order, category.name, category.id;
    `),
  ]);

  return { items: categories.rows, parents: parents.rows };
}

export async function saveAdminBrand(pool: Pool, draft: BrandDraft, id?: string) {
  const result = id
    ? await pool.query<{ id: string }>(
        `UPDATE brands SET name = $1, is_active = $2 WHERE id = $3 RETURNING id::TEXT AS id;`,
        [draft.name, draft.isActive, id],
      )
    : await pool.query<{ id: string }>(
        `INSERT INTO brands (name, is_active) VALUES ($1, $2) RETURNING id::TEXT AS id;`,
        [draft.name, draft.isActive],
      );

  return result.rows[0]?.id ?? null;
}

export async function saveAdminCategory(
  pool: Pool,
  draft: CategoryDraft,
  id?: string,
) {
  if (!id && !draft.parentId) {
    throw new AdminValidationError("Vui lòng chọn danh mục cha trước khi tạo danh mục.");
  }

  let belongsToSolarPanelCatalog =
    draft.slug === "tam-pin" || draft.slug.startsWith("tam-pin-");

  if (draft.parentId) {
    const parent = await pool.query<{ exists: boolean; isSolarPanel: boolean }>(
      `
        WITH RECURSIVE category_ancestors AS (
          SELECT id, parent_id, slug FROM categories WHERE id = $1
          UNION
          SELECT parent.id, parent.parent_id, parent.slug
          FROM categories AS parent
          JOIN category_ancestors AS child ON child.parent_id = parent.id
        )
        SELECT
          EXISTS (SELECT 1 FROM categories WHERE id = $1) AS exists,
          EXISTS (SELECT 1 FROM category_ancestors WHERE slug ILIKE 'tam-pin-%') AS "isSolarPanel";
      `,
      [draft.parentId],
    );
    const parentRow = parent.rows[0];
    if (!parentRow?.exists) {
      throw new AdminValidationError("Danh mục cha không tồn tại.");
    }
    belongsToSolarPanelCatalog ||= parentRow.isSolarPanel;

    if (id) {
      const cycle = await pool.query<{ invalid: boolean }>(
        `
          WITH RECURSIVE descendants(id) AS (
            SELECT id FROM categories WHERE id = $1
            UNION
            SELECT child.id
            FROM categories AS child
            JOIN descendants AS parent ON child.parent_id = parent.id
          )
          SELECT EXISTS (SELECT 1 FROM descendants WHERE id = $2) AS invalid;
        `,
        [id, draft.parentId],
      );
      if (cycle.rows[0]?.invalid) {
        throw new AdminValidationError("Danh mục không thể là danh mục cha của chính nó.");
      }
    }
  }

  if (id && await hasSolarPanelAncestor(pool, id)) {
    belongsToSolarPanelCatalog = true;
  }

  if (belongsToSolarPanelCatalog && !SOLAR_PANEL_SLUG_PATTERN.test(draft.slug)) {
    throw new AdminValidationError(
      "Slug danh mục tấm pin phải có dạng tam-pin-ten-danh-muc.",
    );
  }

  const values = [
    draft.name,
    draft.slug,
    draft.parentId,
    draft.filterKey,
    draft.description,
    draft.sortOrder,
    draft.isActive,
  ];
  const result = id
    ? await pool.query<{ id: string }>(
        `
          UPDATE categories
          SET name = $1, slug = $2, parent_id = $3, filter_key = $4,
              description = $5, sort_order = $6, is_active = $7
          WHERE id = $8
          RETURNING id::TEXT AS id;
        `,
        [...values, id],
      )
    : await pool.query<{ id: string }>(
        `
          INSERT INTO categories
            (name, slug, parent_id, filter_key, description, sort_order, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id::TEXT AS id;
        `,
        values,
      );

  return result.rows[0]?.id ?? null;
}

async function hasSolarPanelAncestor(pool: Pool, categoryId: string) {
  const result = await pool.query<{ isSolarPanel: boolean }>(
    `
      WITH RECURSIVE category_ancestors AS (
        SELECT id, parent_id, slug FROM categories WHERE id = $1
        UNION
        SELECT parent.id, parent.parent_id, parent.slug
        FROM categories AS parent
        JOIN category_ancestors AS child ON child.parent_id = parent.id
      )
      SELECT EXISTS (
        SELECT 1 FROM category_ancestors WHERE slug ILIKE 'tam-pin-%'
      ) AS "isSolarPanel";
    `,
    [categoryId],
  );
  return result.rows[0]?.isSolarPanel ?? false;
}

export async function deleteAdminCatalogItem(
  pool: Pool,
  resource: AdminCatalogResource,
  id: string,
) {
  if (resource === "brands") {
    const usage = await pool.query<{ used: boolean }>(
      `
        SELECT EXISTS (SELECT 1 FROM products WHERE brand_id = $1) AS used;
      `,
      [id],
    );
    if (usage.rows[0]?.used) {
      throw new AdminCatalogConflictError(
        "Không thể xóa thương hiệu đang được sản phẩm sử dụng. Hãy ngừng kích hoạt thay thế.",
      );
    }

    const result = await pool.query(`DELETE FROM brands WHERE id = $1`, [id]);
    return result.rowCount === 1;
  }

  const usage = await pool.query<{ used: boolean }>(
    `
      SELECT EXISTS (SELECT 1 FROM products WHERE category_id = $1)
        OR EXISTS (SELECT 1 FROM categories WHERE parent_id = $1) AS used;
    `,
    [id],
  );
  if (usage.rows[0]?.used) {
    throw new AdminCatalogConflictError(
      "Không thể xóa danh mục đang có sản phẩm hoặc danh mục con. Hãy chuyển các mục liên quan trước.",
    );
  }

  const result = await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
  return result.rowCount === 1;
}
