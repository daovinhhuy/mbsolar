export const currentSchemaMigrationSql = `
ALTER TABLE public.categories DROP COLUMN IF EXISTS filter_key;
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS category_group TEXT NOT NULL DEFAULT 'other';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'categories_category_group_valid'
      AND conrelid = 'public.categories'::regclass
  ) THEN
    ALTER TABLE public.categories
      ADD CONSTRAINT categories_category_group_valid
      CHECK (category_group IN ('solar_panel', 'inverter', 'storage_battery', 'commercial_industrial', 'accessory', 'other'));
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS categories_group_active_idx
  ON public.categories (category_group, is_active, sort_order, name);

UPDATE public.categories
SET category_group = CASE
  WHEN slug ILIKE 'tam-pin-%' THEN 'solar_panel'
  WHEN slug ILIKE '%inverter%' THEN 'inverter'
  WHEN slug = 'solax-ci-industrial-storage' THEN 'commercial_industrial'
  WHEN slug IN ('phu-kien', 'tu-dien-hybrid', 'day-dien-dc') THEN 'accessory'
  WHEN slug ILIKE '%battery%' OR slug ILIKE '%storage%' THEN 'storage_battery'
  ELSE category_group
END
WHERE category_group = 'other';

WITH RECURSIVE categorized_children AS (
  SELECT id, parent_id, category_group
  FROM public.categories
  WHERE category_group <> 'other'
  UNION
  SELECT child.id, child.parent_id, parent.category_group
  FROM public.categories AS child
  JOIN categorized_children AS parent ON child.parent_id = parent.id
  WHERE child.category_group = 'other'
)
UPDATE public.categories AS category
SET category_group = categorized_children.category_group
FROM categorized_children
WHERE category.id = categorized_children.id
  AND category.category_group = 'other';

ALTER TABLE public.solutions
  ADD COLUMN IF NOT EXISTS image_1 TEXT,
  ADD COLUMN IF NOT EXISTS content_1 TEXT,
  ADD COLUMN IF NOT EXISTS image_2 TEXT,
  ADD COLUMN IF NOT EXISTS content_2 TEXT,
  ADD COLUMN IF NOT EXISTS image_3 TEXT,
  ADD COLUMN IF NOT EXISTS content_3 TEXT,
  ADD COLUMN IF NOT EXISTS image_4 TEXT,
  ADD COLUMN IF NOT EXISTS content_4 TEXT,
  ADD COLUMN IF NOT EXISTS image_5 TEXT,
  ADD COLUMN IF NOT EXISTS content_5 TEXT,
  ADD COLUMN IF NOT EXISTS image_6 TEXT,
  ADD COLUMN IF NOT EXISTS content_6 TEXT;
`;

export const migrateLegacySolutionSectionsSql = `
WITH legacy_sections AS (
  SELECT
    solution.id,
    regexp_split_to_array(solution.content, E'\\r?\\n[[:space:]]*\\r?\\n') AS paragraphs,
    ARRAY(
      SELECT image.path
      FROM public.solution_images AS relation
      JOIN public.images AS image ON image.id = relation.image_id
      WHERE relation.solution_id = solution.id
      ORDER BY relation.is_primary DESC, relation.sort_order, image.id
      LIMIT 6
    ) AS image_paths
  FROM public.solutions AS solution
)
UPDATE public.solutions AS solution
SET
  image_1 = legacy.image_paths[1],
  content_1 = NULLIF(BTRIM(legacy.paragraphs[1]), ''),
  image_2 = legacy.image_paths[2],
  content_2 = NULLIF(BTRIM(legacy.paragraphs[2]), ''),
  image_3 = legacy.image_paths[3],
  content_3 = NULLIF(BTRIM(legacy.paragraphs[3]), ''),
  image_4 = legacy.image_paths[4],
  content_4 = NULLIF(BTRIM(legacy.paragraphs[4]), ''),
  image_5 = legacy.image_paths[5],
  content_5 = NULLIF(BTRIM(legacy.paragraphs[5]), ''),
  image_6 = legacy.image_paths[6],
  content_6 = NULLIF(
    BTRIM(array_to_string(legacy.paragraphs[6:array_length(legacy.paragraphs, 1)], E'\\n\\n')),
    ''
  )
FROM legacy_sections AS legacy
WHERE solution.id = legacy.id
  AND solution.image_1 IS NULL AND solution.content_1 IS NULL
  AND solution.image_2 IS NULL AND solution.content_2 IS NULL
  AND solution.image_3 IS NULL AND solution.content_3 IS NULL
  AND solution.image_4 IS NULL AND solution.content_4 IS NULL
  AND solution.image_5 IS NULL AND solution.content_5 IS NULL
  AND solution.image_6 IS NULL AND solution.content_6 IS NULL;
`;

export const verifyCurrentSchemaMigrationSql = `
SELECT
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'category_group'
  ) AS category_group_present,
  NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'filter_key'
  ) AS category_filter_key_removed,
  (
    SELECT count(*)::int FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'solutions'
      AND column_name = ANY(ARRAY[
        'image_1', 'content_1', 'image_2', 'content_2', 'image_3', 'content_3',
        'image_4', 'content_4', 'image_5', 'content_5', 'image_6', 'content_6'
      ])
  ) AS solution_section_columns;
`;
