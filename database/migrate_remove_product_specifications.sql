-- Removes the unused normalized product specifications column.
BEGIN;

ALTER TABLE products DROP COLUMN IF EXISTS specifications;

COMMIT;
