-- Add stable product type classification to categories.
BEGIN;

ALTER TABLE categories DROP COLUMN IF EXISTS filter_key;

ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS category_group TEXT NOT NULL DEFAULT 'other';

UPDATE categories
SET category_group = CASE
    WHEN slug ILIKE 'tam-pin-%' THEN 'solar_panel'
    WHEN slug ILIKE '%inverter%' THEN 'inverter'
    WHEN slug = 'solax-ci-industrial-storage'
        THEN 'commercial_industrial'
    WHEN slug IN ('phu-kien', 'tu-dien-hybrid', 'day-dien-dc')
        THEN 'accessory'
    WHEN slug ILIKE '%battery%' OR slug ILIKE '%storage%'
        THEN 'storage_battery'
    ELSE category_group
END
WHERE category_group = 'other';

WITH RECURSIVE categorized_children AS (
    SELECT id, parent_id, category_group
    FROM categories
    WHERE category_group <> 'other'
    UNION
    SELECT child.id, child.parent_id, parent.category_group
    FROM categories AS child
    JOIN categorized_children AS parent ON child.parent_id = parent.id
    WHERE child.category_group = 'other'
)
UPDATE categories AS category
SET category_group = categorized_children.category_group
FROM categorized_children
WHERE category.id = categorized_children.id
  AND category.category_group = 'other';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'categories_category_group_valid'
          AND conrelid = 'categories'::regclass
    ) THEN
        ALTER TABLE categories
            ADD CONSTRAINT categories_category_group_valid
            CHECK (category_group IN ('solar_panel', 'inverter', 'storage_battery', 'commercial_industrial', 'accessory', 'other'));
    END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS categories_group_active_idx
    ON categories (category_group, is_active, sort_order, name);

COMMIT;
