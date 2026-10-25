import type { Pool, PoolClient } from "pg";
import {
  AdminValidationError,
  normalizeImagePaths,
  parseBoolean,
  parseDatabaseId,
  parseRequiredText,
  parseSortOrder,
} from "@/lib/adminApi";

export type ProductDraft = {
  brandId: string;
  categoryId: string;
  slug: string;
  name: string;
  modelNumber: string | null;
  description: string;
  badge: string | null;
  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  sortOrder: number;
  images: string[];
};

export function parseProductDraft(value: unknown): ProductDraft {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AdminValidationError("Dữ liệu gửi lên không hợp lệ.");
  }

  const body = value as Record<string, unknown>;
  const brandId = typeof body.brandId === "string" ? body.brandId : "";
  const categoryId = typeof body.categoryId === "string" ? body.categoryId : "";
  if (!parseDatabaseId(brandId) || !parseDatabaseId(categoryId)) {
    throw new AdminValidationError("Vui lòng chọn thương hiệu và danh mục.");
  }

  const slug = parseRequiredText(body.slug, "Đường dẫn sản phẩm").toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new AdminValidationError("Đường dẫn chỉ gồm chữ thường, số và dấu gạch ngang.");
  }

  const modelNumber = typeof body.modelNumber === "string" ? body.modelNumber.trim() : "";
  const badge = typeof body.badge === "string" ? body.badge.trim() : "";
  const draft: ProductDraft = {
    brandId,
    categoryId,
    slug,
    name: parseRequiredText(body.name, "Tên sản phẩm"),
    modelNumber: modelNumber || null,
    description: parseRequiredText(body.description, "Mô tả"),
    badge: badge || null,
    isNew: parseBoolean(body.isNew),
    isBestSeller: parseBoolean(body.isBestSeller),
    isActive: parseBoolean(body.isActive, true),
    sortOrder: parseSortOrder(body.sortOrder),
    images: normalizeImagePaths(body.images ?? []),
  };

  if (
    draft.name.length > 300 ||
    draft.slug.length > 180 ||
    (draft.modelNumber?.length ?? 0) > 200 ||
    draft.description.length > 50000 ||
    (draft.badge?.length ?? 0) > 120
  ) {
    throw new AdminValidationError("Một hoặc nhiều trường vượt quá giới hạn cho phép.");
  }

  return draft;
}

export async function listAdminProducts(pool: Pool) {
  const [products, brands, categories] = await Promise.all([
    pool.query(`
      SELECT
        p.id::TEXT AS id,
        p.brand_id::TEXT AS "brandId",
        b.name AS "brandName",
        p.category_id::TEXT AS "categoryId",
        c.name AS "categoryName",
        c.parent_id::TEXT AS "categoryParentId",
        p.slug,
        p.name,
        p.model_number AS "modelNumber",
        p.description,
        p.badge,
        p.is_new AS "isNew",
        p.is_best_seller AS "isBestSeller",
        p.is_active AS "isActive",
        p.sort_order AS "sortOrder",
        COALESCE(
          (
            SELECT json_agg(image.path ORDER BY relation.is_primary DESC, relation.sort_order, image.id)
            FROM product_images AS relation
            JOIN images AS image ON image.id = relation.image_id
            WHERE relation.product_id = p.id
          ),
          '[]'::JSON
        ) AS images
      FROM products AS p
      JOIN brands AS b ON b.id = p.brand_id
      JOIN categories AS c ON c.id = p.category_id
      ORDER BY p.sort_order, p.name;
    `),
    pool.query(`
      SELECT id::TEXT AS id, name
      FROM brands
      WHERE is_active = TRUE
      ORDER BY name;
    `),
    pool.query(`
      SELECT
        category.id::TEXT AS id,
        category.name,
        category.parent_id::TEXT AS "parentId",
        parent.name AS "parentName"
      FROM categories AS category
      LEFT JOIN categories AS parent ON parent.id = category.parent_id
      WHERE category.is_active = TRUE
      ORDER BY parent.sort_order NULLS FIRST, parent.name, category.sort_order, category.name;
    `),
  ]);

  return {
    items: products.rows,
    brands: brands.rows,
    categories: categories.rows,
  };
}

async function replaceProductImages(
  client: PoolClient,
  productId: string,
  name: string,
  paths: string[],
) {
  await client.query("DELETE FROM product_images WHERE product_id = $1", [productId]);

  for (const [sortOrder, path] of paths.entries()) {
    const imageResult = await client.query<{ id: string }>(
      `
        INSERT INTO images (path, alt_text)
        VALUES ($1, $2)
        ON CONFLICT (path) DO UPDATE SET alt_text = COALESCE(images.alt_text, EXCLUDED.alt_text)
        RETURNING id::TEXT AS id;
      `,
      [path, name],
    );
    const imageId = imageResult.rows[0]?.id;
    if (!imageId) throw new Error("Không thể lưu ảnh sản phẩm.");

    await client.query(
      `
        INSERT INTO product_images (product_id, image_id, sort_order, is_primary)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (product_id, image_id)
        DO UPDATE SET sort_order = EXCLUDED.sort_order, is_primary = EXCLUDED.is_primary;
      `,
      [productId, imageId, sortOrder, sortOrder === 0],
    );
  }
}

export async function saveProduct(pool: Pool, draft: ProductDraft, id?: string) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = id
      ? await client.query<{ id: string }>(
          `
            UPDATE products
            SET brand_id = $1, category_id = $2, slug = $3, name = $4,
                model_number = $5, description = $6, badge = $7,
                is_new = $8, is_best_seller = $9, is_active = $10,
                sort_order = $11
            WHERE id = $12
            RETURNING id::TEXT AS id;
          `,
          [
            draft.brandId,
            draft.categoryId,
            draft.slug,
            draft.name,
            draft.modelNumber,
            draft.description,
            draft.badge,
            draft.isNew,
            draft.isBestSeller,
            draft.isActive,
            draft.sortOrder,
            id,
          ],
        )
      : await client.query<{ id: string }>(
          `
            INSERT INTO products
              (brand_id, category_id, slug, name, model_number, description,
               badge, is_new, is_best_seller, is_active, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id::TEXT AS id;
          `,
          [
            draft.brandId,
            draft.categoryId,
            draft.slug,
            draft.name,
            draft.modelNumber,
            draft.description,
            draft.badge,
            draft.isNew,
            draft.isBestSeller,
            draft.isActive,
            draft.sortOrder,
          ],
        );

    const productId = result.rows[0]?.id;
    if (!productId) {
      await client.query("ROLLBACK");
      return null;
    }

    await replaceProductImages(client, productId, draft.name, draft.images);
    await client.query("COMMIT");
    return productId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteProduct(pool: Pool, id: string) {
  const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return result.rowCount === 1;
}
