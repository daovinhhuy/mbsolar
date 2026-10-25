-- Upsert products and related brands/categories from SOLIS and SUNGROW sheets (18 products).
-- Prices are VND and include VAT; source list date: 2026-10-12.
-- Idempotent by product slug; safe to run again.
BEGIN;
INSERT INTO brands (name,is_active) VALUES ('Solis',TRUE) ON CONFLICT (name) DO UPDATE SET is_active=TRUE;
INSERT INTO brands (name,is_active) VALUES ('Sungrow',TRUE) ON CONFLICT (name) DO UPDATE SET is_active=TRUE;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Inverter Hybrid Solis 1 phase','solis-inverter-hybrid-1-phase','solis-hybrid-1phase','Inverter hybrid Solis 1 phase.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Inverter Hybrid Solis 3 phase','solis-inverter-hybrid-3-phase','solis-hybrid-3phase','Inverter hybrid Solis 3 phase.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Inverter Hybrid Sungrow 1 phase','sungrow-inverter-hybrid-1-phase','sungrow-hybrid-1phase','Inverter hybrid Sungrow 1 phase.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Pin lưu trữ Solis điện áp thấp','solis-battery-low-voltage','solis-battery-lv','Pin lưu trữ điện áp thấp thương hiệu Solis.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Pin lưu trữ Sungrow điện áp thấp','sungrow-battery-low-voltage','sungrow-battery-lv','Pin lưu trữ điện áp thấp thương hiệu Sungrow.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;

INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-1-phase'), 'solis-s6-eh1p6k-l-plus', 'Biến tần Inverter Hybrid Solis 6kW_Có Màn Hình LCD', 'S6-EH1P6K-L-PLUS', 'Biến tần Inverter Hybrid Solis 6kW_Có Màn Hình LCD
Model: S6-EH1P6K-L-PLUS
Công suất PV tối đa (khuyến nghị) : 12,000 Wp
Điện áp DC tối đa: 500 V
Dải điện áp MPPT: 90 – 435 V
Số MPPT / Chuỗi : 2/2
Công suất AC định mức: 6.000 W
Công suất AC định mức: 6.000 W
Khối lượng: 23 kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-1-phase'), 'solis-s6-eh1p8k-l-plus', 'Biến tần Inverter Hybrid Solis 8kW_Có Màn Hình LCD', 'S6-EH1P8K-L-PLUS', 'Biến tần Inverter Hybrid Solis 8kW_Có Màn Hình LCD
Model: S6-EH1P8K-L-PLUS
Công suất PV tối đa (khuyến nghị) : 16,000 Wp
Điện áp DC tối đa: 500 V
Dải điện áp MPPT: 90 – 435 V
Số MPPT / Chuỗi : 2/4
Công suất AC định mức: 8.000 W
Công suất AC định mức: 8.000 W
Khối lượng: 23,5 kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 1) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-1-phase'), 'solis-s6-eh1p10k-l-plus-21a', 'Biến tần Inverter Hybrid Solis 10kW_Có Màn Hình LCD', 'S6-EH1P10K-L-PLUS (21A)', 'Biến tần Inverter Hybrid Solis 10kW_Có Màn Hình LCD
Model: S6-EH1P10K-L-PLUS (21A)
Công suất PV tối đa (khuyến nghị) : 20,000 Wp
Điện áp DC tối đa: 500 V
Dải điện áp MPPT: 90 – 435 V
Số MPPT / Chuỗi : 2/4
Công suất AC định mức: 10.000 W
Công suất AC định mức: 10.000 W
Khối lượng: 23,8 kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 2) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-1-phase'), 'solis-s6-eh1p12k03-nv-yd-l', 'Biến tần Inverter Hybrid Solis 12kW', 'S6-EH1P12K03-NV-YD-L', 'Biến tần Inverter Hybrid Solis 12kW
Model: S6-EH1P12K03-NV-YD-L
Công suất PV tối đa (khuyến nghị) : 24,000 Wp
Điện áp DC tối đa: 550 V
Dải điện áp MPPT: 80 – 520 V
Số MPPT / Chuỗi : 3/6
Công suất AC định mức: 12.000 W
Công suất AC định mức: 12.000 W
Khối lượng: 55,5 kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 3) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-1-phase'), 'solis-s6-eh1p14k03-nv-yd-l', 'Biến tần Inverter Hybrid Solis 14kW', 'S6-EH1P14K03-NV-YD-L', 'Biến tần Inverter Hybrid Solis 14kW
Model: S6-EH1P14K03-NV-YD-L
Công suất PV tối đa (khuyến nghị) : 28,000 Wp
Điện áp DC tối đa: 550 V
Dải điện áp MPPT: 80 – 520 V
Số MPPT / Chuỗi : 3/6
Công suất AC định mức: 14.000 W
Công suất AC định mức: 14.000 W
Khối lượng: 55,5 kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 4) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-1-phase'), 'solis-s6-eh1p16k03-nv-yd-l', 'Biến tần Inverter Hybrid Solis 16kW', 'S6-EH1P16K03-NV-YD-L', 'Biến tần Inverter Hybrid Solis 16kW
Model: S6-EH1P16K03-NV-YD-L
Công suất PV tối đa (khuyến nghị) : 32,000 Wp
Điện áp DC tối đa: 550 V
Dải điện áp MPPT: 80 – 520 V
Số MPPT / Chuỗi : 3/6
Công suất AC định mức: 16.000 W
Công suất AC định mức: 16.000 W
Khối lượng: 55,5 kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 5) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-1-phase'), 'solis-s6-eh1p18k03-nv-yd-l', 'Biến tần Inverter Hybrid Solis 18kW', 'S6-EH1P18K03-NV-YD-L', 'Biến tần Inverter Hybrid Solis 18kW
Model: S6-EH1P18K03-NV-YD-L
Công suất PV tối đa (khuyến nghị) : 36,000 Wp
Điện áp DC tối đa: 550 V
Dải điện áp MPPT: 80 – 520 V
Số MPPT / Chuỗi : 3/6
Công suất AC định mức: 18.000 W
Công suất AC định mức: 18.000 W
Khối lượng: 55,5 kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 6) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-3-phase'), 'solis-s6-eh3p8k02-nv-yd-l', 'Biến tần Inverter Hybrid Solis 8kW 3 Pha', 'S6-EH3P8K02-NV-YD-L', 'Biến tần Inverter Hybrid Solis 8kW 3 Pha
Model: S6-EH3P8K02-NV-YD-L
Công suất PV tối đa (khuyến nghị) : 16,000 Wp
Điện áp DC tối đa: 550 V
Dải điện áp MPPT: 200 – 850 V
Số MPPT / Chuỗi : 2/3
Công suất AC định mức: 8.000 W
Công suất AC định mức: 8.000 W
Khối lượng: 42kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-3-phase'), 'solis-s6-eh3p10k02-nv-yd-l', 'Biến tần Inverter Hybrid Solis 10kW 3 Pha', 'S6-EH3P10K02-NV-YD-L', 'Biến tần Inverter Hybrid Solis 10kW 3 Pha
Model: S6-EH3P10K02-NV-YD-L
Công suất PV tối đa (khuyến nghị) : 20,000 Wp
Điện áp DC tối đa: 550 V
Dải điện áp MPPT: 200 – 850 V
Số MPPT / Chuỗi : 2/3
Công suất AC định mức: 10.000 W
Công suất AC định mức: 10.000 W
Khối lượng: 42kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 1) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-3-phase'), 'solis-s6-eh3p12k02-nv-yd-l', 'Biến tần Inverter Hybrid Solis 12kW 3 Pha', 'S6-EH3P12K02-NV-YD-L', 'Biến tần Inverter Hybrid Solis 12kW 3 Pha
Model: S6-EH3P12K02-NV-YD-L
Công suất PV tối đa (khuyến nghị) : 24,000 Wp
Điện áp DC tối đa: 550 V
Dải điện áp MPPT: 200 – 850 V
Số MPPT / Chuỗi : 2/3
Công suất AC định mức: 12.000 W
Công suất AC định mức: 12.000 W
Khối lượng: 42kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 2) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-3-phase'), 'solis-s6-eh3p15k02-nv-yd-l', 'Biến tần Inverter Hybrid Solis 15kW 3 Pha', 'S6-EH3P15K02-NV-YD-L', 'Biến tần Inverter Hybrid Solis 15kW 3 Pha
Model: S6-EH3P15K02-NV-YD-L
Công suất PV tối đa (khuyến nghị) : 30,000 Wp
Điện áp DC tối đa: 550 V
Dải điện áp MPPT: 200 – 850 V
Số MPPT / Chuỗi : 2/4
Công suất AC định mức: 15.000 W
Công suất AC định mức: 15.000 W
Khối lượng: 42kg
Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 3) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-inverter-hybrid-3-phase'), 'solis-bien-tan-inverter-hybrid-solis-18kw-3-pha', 'Biến tần Inverter Hybrid Solis 18kW 3 Pha', NULL, 'Biến tần Inverter Hybrid Solis 18kW 3 Pha
-Model: S6-EH3P12K02-NV-YD-L
-Công suất PV tối đa (khuyến nghị) : 36,000 Wp
-Điện áp DC tối đa: 550 V
-Dải điện áp MPPT: 200 – 850 V
-Số MPPT / Chuỗi : 2/4
-Công suất AC định mức: 12.000 W
-Công suất AC định mức: 12.000 W
-Khối lượng: 42kg
-Tương thích nhiều nhiều loại Pin Lithium, Axit-chì
-Chuẩn bảo vệ : IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 05 năm

Ghi chú: SOLIS
BẢO HÀNH 05 NĂM', 4) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Solis'), (SELECT id FROM categories WHERE slug='solis-battery-low-voltage'), 'solis-intellihome-16kwh-od', 'Pin lưu trữ Solis 16kWh IntelliHome-16kWh-OD', 'IntelliHome-16kWh-OD', 'Pin lưu trữ Solis 16kWh IntelliHome-16kWh-OD
-Model: IntelliHome-16kWh-OD
-DOD 100%
-Dung lượng: 16kWh
-Điện áp: 51,2V-314Ah
-Công suất sạc/xả: 157A / 157A                     
-Truyền thông: CAN2.0/ RS485
-Cell LFP >6000 cycles
-Kích thước: 470*950*240 mm
-Trọng lượng 126kg 
-Có thể ghép song song lên đến 8 pack
-App Soliscloud, OTA function
-Tiêu chuẩn IP66

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SOLIS
BẢO HÀNH 10 NĂM', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Sungrow'), (SELECT id FROM categories WHERE slug='sungrow-inverter-hybrid-1-phase'), 'sungrow-mg6rl', 'Biến tần Sungrow 6kW MG6RL 1 Pha (Hybrid)', 'MG6RL', 'Biến tần Sungrow 6kW MG6RL 1 Pha (Hybrid)
Công suất PV tối đa (khuyến nghị) : 9.600 Wp
Điện áp DC tối đa: 500 V
Dải điện áp MPPT: 40 – 425 V
Số MPPT / Chuỗi : 2 / 1+1
Công suất AC định mức: 6.000 W
Công suất AC định mức: 6.000 W
Chuẩn bảo vệ : IP65

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SUNGROW
BẢO HÀNH 10 NĂM 
1 ĐỔI 1', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Sungrow'), (SELECT id FROM categories WHERE slug='sungrow-inverter-hybrid-1-phase'), 'sungrow-mg8rl', 'Biến tần Sungrow 8kW MG8RL 1 Pha (Hybrid)', 'MG8RL', 'Biến tần Sungrow 8kW MG8RL 1 Pha (Hybrid)
Công suất PV tối đa (khuyến nghị) : 16,000 Wp
Điện áp DC tối đa: 500 V
Dải điện áp MPPT: 40 – 425 V
Số MPPT / Chuỗi : 3 / 1+1+1
Công suất AC định mức: 8.000 W
Công suất AC định mức: 8.000 W
Chuẩn bảo vệ : IP65

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SUNGROW
BẢO HÀNH 10 NĂM 
1 ĐỔI 1', 1) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Sungrow'), (SELECT id FROM categories WHERE slug='sungrow-inverter-hybrid-1-phase'), 'sungrow-mg10rl', 'Biến tần Sungrow 10kW MG10RL 1 Pha (Hybrid)', 'MG10RL', 'Biến tần Sungrow 10kW MG10RL 1 Pha (Hybrid)
Công suất PV tối đa (khuyến nghị) : 20,000 Wp
Điện áp DC tối đa: 500 V
Dải điện áp MPPT: 40 – 425 V
Số MPPT / Chuỗi : 3 / 1+1+1
Công suất AC định mức: 10.000 W
Công suất AC định mức: 10.000 W
Chuẩn bảo vệ : IP65

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SUNGROW
BẢO HÀNH 10 NĂM 
1 ĐỔI 1', 2) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Sungrow'), (SELECT id FROM categories WHERE slug='sungrow-inverter-hybrid-1-phase'), 'sungrow-mg12rl', 'Biến tần Sungrow 12kW MG12RL 1 Pha (Hybrid)', 'MG12RL', 'Biến tần Sungrow 12kW MG12RL 1 Pha (Hybrid)
Công suất PV tối đa (khuyến nghị) : 24,000 Wp
Điện áp DC tối đa: 500 V
Dải điện áp MPPT: 40 – 425 V
Số MPPT / Chuỗi : 3 độc lập
Công suất AC định mức: 12.000 W
Công suất AC định mức: 12.000 W
Chuẩn bảo vệ : IP65

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SUNGROW
BẢO HÀNH 10 NĂM 
1 ĐỔI 1', 3) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE name='Sungrow'), (SELECT id FROM categories WHERE slug='sungrow-battery-low-voltage'), 'sungrow-mbl160', 'Pin Lưu Trữ Sungrow MBL160', 'MBL160', 'Pin Lưu Trữ Sungrow MBL160
Model No: Tower T7
Điện áp: 192V
Công suất xả liên tục: 4,26kwh
Truyền thông: CAN2.0/RS485/Wifi/LAN IP54
Trọng lượng: 105kg
Cell LFP > 6000 Cycles

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SUNGROW
BẢO HÀNH 10 NĂM 
1 ĐỔI 1', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
COMMIT;
