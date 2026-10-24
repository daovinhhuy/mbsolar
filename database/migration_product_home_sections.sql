ALTER TABLE products
    ADD COLUMN IF NOT EXISTS is_new BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS products_newest_idx
    ON products (created_at DESC, sort_order, name) WHERE is_active;

CREATE INDEX IF NOT EXISTS products_best_seller_sort_idx
    ON products (sort_order, name) WHERE is_active AND is_best_seller;
