-- Adds the inverter brands and categories used by the inverter submenus.
-- Products are added separately when verified product information is available.
BEGIN;

INSERT INTO brands (name, is_active)
VALUES
  ('Solis', TRUE),
  ('Sungrow', TRUE)
ON CONFLICT (name) DO UPDATE SET is_active = TRUE;

INSERT INTO categories (name, slug, filter_key, description, sort_order)
VALUES
  (
    'Inverter Hybrid Solis 1 phase',
    'solis-inverter-hybrid-1-phase',
    'solis-hybrid-1phase',
    'Inverter hybrid Solis 1 phase.',
    0
  ),
  (
    'Inverter Hybrid Solis 3 phase',
    'solis-inverter-hybrid-3-phase',
    'solis-hybrid-3phase',
    'Inverter hybrid Solis 3 phase.',
    0
  ),
  (
    'Inverter Hybrid Sungrow 1 phase',
    'sungrow-inverter-hybrid-1-phase',
    'sungrow-hybrid-1phase',
    'Inverter hybrid Sungrow 1 phase.',
    0
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  filter_key = EXCLUDED.filter_key,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

COMMIT;
