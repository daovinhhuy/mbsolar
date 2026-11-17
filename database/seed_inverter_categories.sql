-- Adds the inverter brands and categories used by the inverter submenus.
-- Products are added separately when verified product information is available.
BEGIN;

INSERT INTO brands (name, is_active)
VALUES
  ('Solis', TRUE),
  ('Sungrow', TRUE)
ON CONFLICT (name) DO UPDATE SET is_active = TRUE;

INSERT INTO categories (name, slug, description, sort_order)
VALUES
  (
    'Inverter Hybrid Solis 1 phase',
    'solis-inverter-hybrid-1-phase',
    'Inverter hybrid Solis 1 phase.',
    0
  ),
  (
    'Inverter Hybrid Solis 3 phase',
    'solis-inverter-hybrid-3-phase',
    'Inverter hybrid Solis 3 phase.',
    0
  ),
  (
    'Inverter Hybrid Sungrow 1 phase',
    'sungrow-inverter-hybrid-1-phase',
    'Inverter hybrid Sungrow 1 phase.',
    0
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;


UPDATE categories
SET category_group = CASE
    WHEN slug ILIKE 'tam-pin-%' THEN 'solar_panel'
    WHEN slug ILIKE '%inverter%' THEN 'inverter'
    WHEN slug = 'solax-ci-industrial-storage' THEN 'commercial_industrial'
    WHEN slug IN ('phu-kien', 'tu-dien-hybrid', 'day-dien-dc') THEN 'accessory'
    WHEN slug ILIKE '%battery%' OR slug ILIKE '%storage%' THEN 'storage_battery'
    ELSE category_group
END
WHERE category_group = 'other';

COMMIT;
