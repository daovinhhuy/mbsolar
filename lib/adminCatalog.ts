import type { Pool } from "pg";
import {
  AdminValidationError,
  parseBoolean,
  parseRequiredText,
  parseSortOrder,
} from "@/lib/adminApi";

export type AdminCatalogResource = "brands" | "categories";
export const CATEGORY_GROUPS = [
  "solar_panel",
  "inverter",
  "storage_battery",
  "commercial_industrial",
  "accessory",
  "other",
] as const;
export type CategoryGroup = (typeof CATEGORY_GROUPS)[number];

export type BrandDraft = {
  name: string;
  isActive: boolean;
};

export type CategoryDraft = {
  name: string;
  slug: string;
  categoryGroup: CategoryGroup;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

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

  const categoryGroup = parseRequiredText(body.categoryGroup, "categoryGroup");
  if (!CATEGORY_GROUPS.includes(categoryGroup as CategoryGroup)) {
    throw new AdminValidationError("Nh\u00f3m danh m\u1ee5c kh\u00f4ng h\u1ee3p l\u1ec7.");
  }

  const draft = {
    name: parseRequiredText(body.name, "Tên danh mục"),
    slug,
    categoryGroup: categoryGroup as CategoryGroup,
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

  const { rows } = await pool.query(`
    SELECT
      category.id::TEXT AS id,
      category.name,
      category.slug,
      category.category_group AS "categoryGroup",
      category.description,
      category.sort_order AS "sortOrder",
      category.is_active AS "isActive",
      (SELECT COUNT(*)::INTEGER FROM products WHERE category_id = category.id) AS "productCount"
    FROM categories AS category
    ORDER BY category.sort_order, category.name, category.id;
  `);

  return { items: rows };
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
  const values = [
    draft.name,
    draft.slug,
    draft.categoryGroup,
    draft.description,
    draft.sortOrder,
    draft.isActive,
  ];
  const result = id
    ? await pool.query<{ id: string }>(
        `
          UPDATE categories
          SET name = $1, slug = $2, category_group = $3,
              description = $4, sort_order = $5, is_active = $6
          WHERE id = $7
          RETURNING id::TEXT AS id;
        `,
        [...values, id],
      )
    : await pool.query<{ id: string }>(
        `
          INSERT INTO categories
            (name, slug, category_group, description, sort_order, is_active)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id::TEXT AS id;
        `,
        values,
      );

  return result.rows[0]?.id ?? null;
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
