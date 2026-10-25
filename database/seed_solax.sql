-- SolaX price list seed generated from the SolaX worksheet (26 products; prices include VAT).
-- Safe to rerun: brands, categories, and products are upserted by stable names/slugs.
INSERT INTO brands (name, is_active) VALUES ('SolaX Power', TRUE) ON CONFLICT (name) DO UPDATE SET is_active = TRUE;
INSERT INTO categories (name, slug, filter_key, description, sort_order) VALUES ('Inverter Hybrid SolaX 1 pha', 'solax-inverter-hybrid-1-phase', 'hybrid-1phase', 'INVERTER SOLAX HYBRID 1 PHASE (Combo cùng Pin lưu trữ SOLAX BH 10 Năm)', 0) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, filter_key = EXCLUDED.filter_key, description = EXCLUDED.description;
INSERT INTO categories (name, slug, filter_key, description, sort_order) VALUES ('Inverter Hybrid SolaX 3 pha điện áp thấp', 'solax-inverter-hybrid-3-phase-low-voltage', 'hybrid-3phase-lv', 'INVERTER SOLAX HYBRID 3 PHASE Áp Thấp (Combo cùng Pin lưu trữ SOLAX BH 10 Năm)', 0) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, filter_key = EXCLUDED.filter_key, description = EXCLUDED.description;
INSERT INTO categories (name, slug, filter_key, description, sort_order) VALUES ('Inverter Hybrid SolaX 3 pha điện áp cao', 'solax-inverter-hybrid-3-phase-high-voltage', 'hybrid-3phase-hv', 'INVERTER SOLAX HYBRID 3 PHASE Áp Cao', 0) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, filter_key = EXCLUDED.filter_key, description = EXCLUDED.description;
INSERT INTO categories (name, slug, filter_key, description, sort_order) VALUES ('Pin lưu trữ SolaX điện áp thấp', 'solax-battery-low-voltage', 'battery-low-voltage', 'BATTERY ÁP THẤP SOLAX (Combo cùng Biến Tần SOLAX BH 10 Năm)', 0) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, filter_key = EXCLUDED.filter_key, description = EXCLUDED.description;
INSERT INTO categories (name, slug, filter_key, description, sort_order) VALUES ('Hệ thống lưu trữ công nghiệp C&I SolaX', 'solax-ci-industrial-storage', 'ci-storage', 'C&I ÁP CAO LƯU TRỮ CÔNG NGHIỆP', 0) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, filter_key = EXCLUDED.filter_key, description = EXCLUDED.description;

INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-1-phase'),  'solax-x1-hyb-5-0-lv-hybrid-5kw-ip65',  'SolaX X1-HYB-5.0-LV Hybrid 5kw IP65',  'X1-HYB-5.0-LV Hybrid 5kw IP65',  'Model: X1-HYB-5.0-LV Hybrid 5kw IP65
2 MPPT, With DC Switch, Wifi + CT bám tải
Điện áp PV tối đa 550V
MAX PV tối đa: 10.000W
MAX PV chuyển đổi: 10.000W
MAX hòa lưới AC : 5.000W
MAX Backup AC: 5.500W
Tích hợp SPD (AC,DC) Bảo vệ quá điện áp và dòng rò

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  0) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-1-phase'),  'solax-x1-hyb-6-0-lv-hybrid-6kw-ip65',  'SolaX X1-HYB-6.0-LV Hybrid 6kw IP65',  'X1-HYB-6.0-LV Hybrid 6kw IP65',  'Model: X1-HYB-6.0-LV Hybrid 6kw IP65
2 MPPT, With DC Switch , Wifi + CT bám tải
Điện áp PV tối đa 550V
MAX PV tối đa: 12.000W
MAX PV chuyển đổi: 12.000W
MAX hòa lưới AC: 6.000W
MAX Backup AC : 6.600W
Tích hợp SPD (AC,DC) Bảo vệ quá điện áp và dòng rò

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  1) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-1-phase'),  'solax-x1-hyb-6-0-lv-eu-hybrid-6kw-ip65',  'SolaX X1-HYB-6.0-LV-EU Hybrid 6kw IP65',  'X1-HYB-6.0-LV-EU Hybrid 6kw IP65',  'Model: X1-HYB-6.0-LV-EU Hybrid 6kw IP65 
2 MPPT, With DC Switch, Wifi + CT bám tải
Điện áp PV tối đa 550V
MAX PV tối đa: 12.000W
MAX PV chuyển đổi: 12.000W
MAX hòa lưới AC: 6.000W
MAX Backup AC : 6.600W
Tích hợp SPD (AC,DC) Bảo vệ quá điện áp và dòng rò

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  2) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-1-phase'),  'solax-x1-1-reno-8-0-lv-san-pham-new',  'SolaX X1-1 RENO-8.0-LV SẢN PHẨM NEW',  'X1-1 RENO-8.0-LV SẢN PHẨM NEW',  'Model: X1-1 RENO-8.0-LV SẢN PHẨM NEW
2 MPPT, 4 STRING, With DC Switch, Wifi + CT bám tải
Điện áp PV tối đa 600V
MAX PV tối đa: 16.000W
MAX PV chuyển đổi: 16.000W
MAX hòa lưới AC : 8.000W
MAX Backup AC: 8.800W
Tích hợp SPD (AC,DC) Bảo vệ quá điện áp và dòng rò

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  3) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-1-phase'),  'solax-x1-lite-8-lv-hybrid-8kw',  'SolaX X1-LITE-8-LV Hybrid 8kw',  'X1-LITE-8-LV Hybrid 8kw',  'Model: X1-LITE-8-LV Hybrid 8kw
2 MPPT, 4 STRING, With DC Switch, Wifi + CT bám tải
Điện áp PV tối đa 600V
MAX PV tối đa: 16.000W
MAX PV chuyển đổi: 16.000W
MAX hòa lưới AC : 8.000W
MAX Backup AC: 8.800W
Tích hợp SPD (AC,DC) Bảo vệ quá điện áp và dòng rò

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  4) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-1-phase'),  'solax-x1-lite-10-lv-hybrid-10kw',  'SolaX X1-LITE-10-LV Hybrid 10kw',  'X1-LITE-10-LV Hybrid 10kw',  'Model: X1-LITE-10-LV Hybrid 10kw
2 MPPT, 4 STRING, With DC Switch , wifi
Điện áp PV tối đa 600V
MAX PV tối đa: 20.000W
MAX PV chuyển đổi: 20.000W
MAX hòa lưới AC: 10.000W
MAX Backup AC : 11.000W
Tích hợp SPD (AC,DC) Bảo vệ quá điện áp và dòng rò

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  5) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-1-phase'),  'solax-x1-lite-12-lv-hybrid-12kw',  'SolaX X1-LITE-12-LV Hybrid 12kw',  'X1-LITE-12-LV Hybrid 12kw',  'Model: X1-LITE-12-LV Hybrid 12kw
3 MPPT, 6 STRING, With DC Switch , Wifi + CT bám tải
Điện áp PV tối đa 600V
MAX PV tối đa: 24.000W
MAX PV chuyển đổi: 24.000W
MAX hòa lưới AC : 12.000W
MAX Backup AC: 13.200W
Tích hợp SPD (AC,DC) Bảo vệ quá điện áp và dòng rò

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  6) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-low-voltage'),  'solax-x3-neo-10k-lv-hybrid-10kw',  'SolaX X3-NEO-10K-LV Hybrid 10kw',  'X3-NEO-10K-LV Hybrid 10kw',  'Model: X3-NEO-10K-LV Hybrid 10kw
2 MPPT, 3 STRING, With DC Switch , Wifi + CT bám tải
Điện áp PV tối đa 1000V
MAX PV tối đa: 20.000W
MAX PV chuyển đổi: 20.000W
MAX hòa lưới AC : 10.000W
MAX Backup AC: 11.000W

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  7) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-low-voltage'),  'solax-x3-neo-12k-lv-hybrid-12kw',  'SolaX X3-NEO-12K-LV Hybrid 12kw',  'X3-NEO-12K-LV Hybrid 12kw',  'Model: X3-NEO-12K-LV Hybrid 12kw
2 MPPT, 4 STRING, With DC Switch , wifi
Điện áp PV tối đa 1000V
MAX PV tối đa: 24.000W
MAX PV chuyển đổi: 24.000W
MAX hòa lưới AC : 12.000W
MAX Backup AC: 13.000W

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  8) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-low-voltage'),  'solax-x3-neo-15k-lv-hybrid-15kw',  'SolaX X3-NEO-15K-LV Hybrid 15kw',  'X3-NEO-15K-LV Hybrid 15kw',  'Model: X3-NEO-15K-LV Hybrid 15kw
2 MPPT, 4 STRING, With DC Switch , wifi
Điện áp PV tối đa 1000V
MAX PV tối đa: 30.000W
MAX PV chuyển đổi: 30.000W
MAX hòa lưới AC : 15.000W
MAX Backup AC: 16.500W

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  9) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-low-voltage'),  'solax-x3-neo-20k-lv-hybrid-20kw',  'SolaX X3-NEO-20K-LV Hybrid 20kw',  'X3-NEO-20K-LV Hybrid 20kw',  'Model: X3-NEO-20K-LV Hybrid 20kw
2 MPPT, 4 STRING, With DC Switch , wifi
Điện áp PV tối đa 1000V
MAX PV tối đa: 40.000W
MAX PV chuyển đổi: 40.000W
MAX hòa lưới AC : 20.000W
MAX Backup AC: 24.200W

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM
Combo Battery SolaX',  10) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-high-voltage'),  'solax-x3-ael80',  'SolaX X3 AEL80',  'X3 AEL80',  'Biến Tần Inverter Solax Hybrid 3 pha X3 AEL80 80kw
-Model: X3 AEL80
-Hiệu suất: Tối đa 98.0% (chuẩn châu Âu 97.2%)
-Công suất PV đầu vào tối đa: 120 kWp
-Dải điện áp hoạt động (MPPT): 160 – 850 V
-Số MPPT / Chuỗi PV: 6 MPPT / 2 chuỗi mỗi MPPT
-Công suất định mức (AC): 80 kW
-Dòng sạc/xả tối đa: 200A (100A × 2 cổng độc lập)
-Kích thước (R × C × S): 1150 × 790 × 365 mm
-Khối lượng tịnh: <165 kg
-Chuẩn bảo vệ: IP66
-Giao tiếp & Kết nối:  RS485, CAN (BMS), TCP ,DI/DO

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX',  11) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-high-voltage'),  'solax-x3-ael99',  'SolaX X3 AEL99',  'X3 AEL99',  'Biến Tần Inverter Solax Hybrid 3 pha X3 AEL99 99kw
-Model: X3 AEL99
-Hiệu suất: Tối đa 98.0% (chuẩn châu Âu 97.2%)
-Công suất PV đầu vào tối đa: 150 kWp
-Dải điện áp hoạt động (MPPT): 160 – 850 V
-Số MPPT / Chuỗi PV: 8 MPPT / 2 chuỗi mỗi MPPT
-Công suất định mức (AC): 99 kW
-Dòng sạc/xả tối đa: 200A (100A × 2 cổng độc lập)
-Kích thước (R × C × S): 1150 × 790 × 365 mm
-Khối lượng tịnh: <165 kg
-Chuẩn bảo vệ: IP66
-Giao tiếp & Kết nối:  RS485, CAN (BMS), TCP ,DI/DO

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX',  12) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-high-voltage'),  'solax-x3-ael100',  'SolaX X3 AEL100',  'X3 AEL100',  'Biến Tần Inverter Solax Hybrid 3 pha X3 AEL100 100kw
-Model: X3 AEL100
-Hiệu suất: Tối đa 98.0% (chuẩn châu Âu 97.2%)
-Công suất PV đầu vào tối đa: 150 kWp
-Dải điện áp hoạt động (MPPT): 160 – 850 V
-Số MPPT / Chuỗi PV: 8 MPPT / 2 chuỗi mỗi MPPT
-Công suất định mức (AC): 100 kW
-Dòng sạc/xả tối đa: 200A (100A × 2 cổng độc lập)
-Kích thước (R × C × S): 1150 × 790 × 365 mm
-Khối lượng tịnh: <165 kg
-Chuẩn bảo vệ: IP66
-Giao tiếp & Kết nối:  RS485, CAN (BMS), TCP ,DI/DO

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX',  13) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-high-voltage'),  'solax-x3-ael125',  'SolaX X3 AEL125',  'X3 AEL125',  'Biến Tần Inverter Solax Hybrid 3 pha X3 AEL125 125kw
-Model: X3 AEL125
-Hiệu suất: Tối đa 98.0% (chuẩn châu Âu 97.2%)
-Công suất PV đầu vào tối đa: 188 kWp
-Dải điện áp hoạt động (MPPT): 160 – 850 V
-Số MPPT / Chuỗi PV: 8 MPPT / 2 chuỗi mỗi MPPT
-Công suất định mức (AC): 125 kW
-Dòng sạc/xả tối đa: 200A (100A × 2 cổng độc lập)
-Kích thước (R × C × S): 1150 × 790 × 365 mm
-Khối lượng tịnh: <165 kg
-Chuẩn bảo vệ: IP66
-Giao tiếp & Kết nối:  RS485, CAN (BMS), TCP ,DI/DO

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX',  14) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-inverter-hybrid-3-phase-high-voltage'),  'solax-x3-ael130',  'SolaX X3 AEL130',  'X3 AEL130',  'Biến Tần Inverter Solax Hybrid 3 pha X3 AEL130 130kw
-Model: X3 AEL130
-Hiệu suất: Tối đa 98.0% (chuẩn châu Âu 97.2%)
-Công suất PV đầu vào tối đa: 195 kWp
-Dải điện áp hoạt động (MPPT): 160 – 850 V
-Số MPPT / Chuỗi PV: 8 MPPT / 2 chuỗi mỗi MPPT
-Công suất định mức (AC): 130 kW
-Dòng sạc/xả tối đa: 200A (100A × 2 cổng độc lập)
-Kích thước (R × C × S): 1150 × 790 × 365 mm
-Khối lượng tịnh: <165 kg
-Chuẩn bảo vệ: IP66
-Giao tiếp & Kết nối:  RS485, CAN (BMS), TCP ,DI/DO

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 7 năm

Ghi chú: SolaX',  15) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-battery-low-voltage'),  'solax-t-bat-tsys-d53-ap-thap-triple-ld-53',  'SolaX T-BAT TSYS-D53 Áp thấp Triple LD 53',  'T-BAT TSYS-D53 Áp thấp Triple LD 53',  'Model: T-BAT TSYS-D53 Áp thấp Triple LD 53
Công suất: 5.3kW
Kích thước 645 x 150 x 430
Tiêu chuẩn chống nước, bụi: IP 65
Cycle life: 6000 Cycles
Với công nghệ pin LiFePO4 NO coban
BẢO HIỂM CHÁY NỔ PVI 10 NĂM

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM',  16) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-battery-low-voltage'),  'solax-t-bat-sys-lv-d150-pro',  'SolaX T-BAT-SYS-LV D150 Pro',  'T-BAT-SYS-LV D150 Pro',  'Model: T-BAT-SYS-LV D150 Pro
Dung lượng: 15kWh
Dạng treo tường/đặt dưới sàn
Khả năng mở rộng đến 16 bộ Pin/dãy.
Độ xả sâu DOD 90%
Tốc độ sạc/xả tối đa 0.5C
Cấp bảo vệ IP65
Kích thước 900 x 540 x 220 mm
Khối lượng 125 kg
BẢO HIỂM CHÁY NỔ PVI 10 NĂM

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM',  17) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-battery-low-voltage'),  'solax-t-bat-tsys-ld160',  'SolaX T-BAT TSYS-LD160',  'T-BAT TSYS-LD160',  'Model: T-BAT TSYS-LD160
Dung lượng:16kWh
Dạng treo tường/đặt dưới sàn
Khả năng mở rộng đến 16 bộ Pin/dãy.
Độ xả sâu DOD 95%
Tốc độ sạc/xả tối đa 0.5/0.7C
Cấp bảo vệ IP40
Kích thước 356 x 953 x 289mm
Khối lượng 118.5 kg
BẢO HIỂM CHÁY NỔ PVI 10 NĂM

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM',  18) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-battery-low-voltage'),  'solax-t-bat-tsys-ld16-s',  'SolaX T-BAT TSYS-LD16-S',  'T-BAT TSYS-LD16-S',  'Model: T-BAT TSYS-LD16-S
Dung lượng:16kWh
Dạng treo tường/đặt dưới sàn
Khả năng mở rộng đến 16 bộ Pin/dãy.
Độ xả sâu DOD 95%
Tốc độ sạc/xả tối đa 0.5/0.7C
Cấp bảo vệ IP65
Kích thước 356 x 953 x 289mm
Khối lượng 118.5 kg
BẢO HIỂM CHÁY NỔ PVI 10 NĂM

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM',  19) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name = 'SolaX Power'),  (SELECT id FROM categories WHERE slug = 'solax-ci-industrial-storage'),  'solax-ss-ac-trene-125kw-261kw',  'SolaX SS-AC-TRENE 125KW/261KW',  'SS-AC-TRENE 125KW/261KW',  'Model: SS-AC-TRENE 125KW/261KW
– Công suất: 125kW
– Hiệu suất: 98%
– Điện 3 pha: 220/380V – 230/400V
– Dòng max: ~189A
– Pin: 650–936V
– Sạc/xả: 202A
– Chuẩn IP66
– chạy ngoài trời
– Quá tải: 120% (1 phút)

Ghi chú: SolaX',  20) ON CONFLICT (slug) DO UPDATE SET brand_id = EXCLUDED.brand_id,  category_id = EXCLUDED.category_id,  name = EXCLUDED.name,  model_number = EXCLUDED.model_number,  description = EXCLUDED.description,  sort_order = EXCLUDED.sort_order;
COMMIT;
