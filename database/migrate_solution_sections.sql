-- Add fixed image/content pairs to solutions and copy the existing ordered data.
BEGIN;

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

WITH legacy_sections AS (
    SELECT
        solution.id,
        regexp_split_to_array(
            solution.content,
            E'\\r?\\n[[:space:]]*\\r?\\n'
        ) AS paragraphs,
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

COMMIT;
