-- Storage battery products imported from SOLAX, SOLIS, BATTERY HITHIUM, BATTERY DYNESS, and SUNGROW tabs.
-- Source price date: 2026-10-12; all prices include VAT.
-- Re-runnable: categories are upserted by slug and products by slug.
BEGIN;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM brands WHERE LOWER(name) = LOWER('SolaX Power')) THEN INSERT INTO brands (name,is_active) VALUES ('SolaX Power',TRUE); END IF;
    IF NOT EXISTS (SELECT 1 FROM brands WHERE LOWER(name) = LOWER('Solis')) THEN INSERT INTO brands (name,is_active) VALUES ('Solis',TRUE); END IF;
    IF NOT EXISTS (SELECT 1 FROM brands WHERE LOWER(name) = LOWER('Sungrow')) THEN INSERT INTO brands (name,is_active) VALUES ('Sungrow',TRUE); END IF;
    IF NOT EXISTS (SELECT 1 FROM brands WHERE LOWER(name) = LOWER('Hithium')) THEN INSERT INTO brands (name,is_active) VALUES ('Hithium',TRUE); END IF;
    IF NOT EXISTS (SELECT 1 FROM brands WHERE LOWER(name) = LOWER('Dyness')) THEN INSERT INTO brands (name,is_active) VALUES ('Dyness',TRUE); END IF;
END;
$$;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Pin lưu trữ SolaX điện áp thấp','solax-battery-low-voltage','battery-low-voltage','Pin lưu trữ SolaX điện áp thấp.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Hệ thống lưu trữ công nghiệp C&I SolaX','solax-ci-industrial-storage','ci-storage','Hệ thống lưu trữ năng lượng công nghiệp C&I của SolaX.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Pin lưu trữ Solis điện áp thấp','solis-battery-low-voltage','solis-battery-lv','Pin lưu trữ điện áp thấp thương hiệu Solis.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Pin lưu trữ Sungrow điện áp thấp','sungrow-battery-low-voltage','sungrow-battery-lv','Pin lưu trữ điện áp thấp thương hiệu Sungrow.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Pin lưu trữ Hithium điện áp thấp','hithium-battery-low-voltage','hithium-battery-lv','Pin lưu trữ điện áp thấp thương hiệu Hithium.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO categories (name,slug,filter_key,description,sort_order) VALUES ('Pin lưu trữ Dyness điện áp thấp','dyness-battery-low-voltage','dyness-battery-lv','Pin lưu trữ điện áp thấp thương hiệu Dyness.',0) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,filter_key=EXCLUDED.filter_key,description=EXCLUDED.description;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-battery-low-voltage'), 'solax-t-bat-tsys-d53-ap-thap-triple-ld-53', 'SolaX T-BAT TSYS-D53 Áp thấp Triple LD 53', 'T-BAT TSYS-D53 Áp thấp Triple LD 53', 'Model: T-BAT TSYS-D53 Áp thấp Triple LD 53
Công suất: 5.3kW
Kích thước 645 x 150 x 430
Tiêu chuẩn chống nước, bụi: IP 65
Cycle life: 6000 Cycles
Với công nghệ pin LiFePO4 NO coban
BẢO HIỂM CHÁY NỔ PVI 10 NĂM

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: SolaX
BẢO HÀNH 10 NĂM', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-battery-low-voltage'), 'solax-t-bat-sys-lv-d150-pro', 'SolaX T-BAT-SYS-LV D150 Pro', 'T-BAT-SYS-LV D150 Pro', 'Model: T-BAT-SYS-LV D150 Pro
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
BẢO HÀNH 10 NĂM', 1) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-battery-low-voltage'), 'solax-t-bat-tsys-ld160', 'SolaX T-BAT TSYS-LD160', 'T-BAT TSYS-LD160', 'Model: T-BAT TSYS-LD160
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
BẢO HÀNH 10 NĂM', 2) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-battery-low-voltage'), 'solax-t-bat-tsys-ld16-s', 'SolaX T-BAT TSYS-LD16-S', 'T-BAT TSYS-LD16-S', 'Model: T-BAT TSYS-LD16-S
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
BẢO HÀNH 10 NĂM', 3) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-ci-industrial-storage'), 'solax-ss-ac-trene-125kw-261kw', 'SolaX SS-AC-TRENE 125KW/261KW', 'SS-AC-TRENE 125KW/261KW', 'Model: SS-AC-TRENE 125KW/261KW
– Công suất: 125kW
– Hiệu suất: 98%
– Điện 3 pha: 220/380V – 230/400V
– Dòng max: ~189A
– Pin: 650–936V
– Sạc/xả: 202A
– Chuẩn IP66
– chạy ngoài trời
– Quá tải: 120% (1 phút)

Ghi chú: SolaX', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-ci-industrial-storage'), 'solax-trene-p125b261l-ac-couple-261kwh', 'SolaX TRENE-P125B261L AC Couple Cabinet 261kWh', 'TRENE-P125B261L', 'TRENE-P125B261L AC couple Cabinet Storage system C&I,
-125kw PCS+261kwh Battery 314Ah
-EMS Included 
-Chống cháy 4 cấp độ
-Tiêu chuẩn ngoài trời
-LÀM MÁT BẰNG CHẤT LỎNG

Bảo hành tiêu chuẩn: Bảo hành: 5 năm sản phẩm, 10 năm hiệu suất pin (≥70% dung lượng)

Ghi chú: SolaX', 1) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-ci-industrial-storage'), 'solax-aelio-p50b100-100kwh', 'SolaX AELIO P50B100 50kW + 100kWh', 'AELIO P50B100', 'AELIO P50B100 50KW
-HYBRID INVERTER AELIO 50KW + 100KWH 
-LFP BATTERY 280A 
*EMS Included chống cháy 4 cấp độ 
-Tiêu chuẩn ngoài trời

Ghi chú: SolaX', 2) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-ci-industrial-storage'), 'solax-aelio-p50b100-200kwh', 'SolaX AELIO P50B100 50kW + 200kWh', 'AELIO P50B100', 'AELIO P50B100 50KW
-HYBRID INVERTER AELIO 50KW + 200KWH 
-LFP BATTERY 280A 
*EMS Included chống cháy 4 cấp độ 
-Tiêu chuẩn ngoài trời

Ghi chú: SolaX', 3) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-ci-industrial-storage'), 'solax-aelio-p60b200-100kwh', 'SolaX AELIO P60B200 60kW + 100kWh', 'AELIO P60B200', 'AELIO P60B200 60KW
-HYBRID INVERTER AELIO 60KW + 100KWH 
-LFP BATTERY 280A 
*EMS Included chống cháy 4 cấp độ 
-Tiêu chuẩn ngoài trời

Ghi chú: SolaX', 4) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('SolaX Power') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solax-ci-industrial-storage'), 'solax-aelio-p60b200-200kwh', 'SolaX AELIO P60B200 60kW + 200kWh', 'AELIO P60B200', 'AELIO P60B200 60KW
-HYBRID INVERTER AELIO 60KW + 200KWH 
-LFP BATTERY 280A 
*EMS Included chống cháy 4 cấp độ 
-Tiêu chuẩn ngoài trời

Ghi chú: SolaX', 5) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('Solis') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='solis-battery-low-voltage'), 'solis-intellihome-16kwh-od', 'Pin lưu trữ Solis 16kWh IntelliHome-16kWh-OD', 'IntelliHome-16kWh-OD', 'Pin lưu trữ Solis 16kWh IntelliHome-16kWh-OD
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
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('Hithium') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='hithium-battery-low-voltage'), 'hithium-hero-ee-maxpower-16', 'Hithium Hero EE MaxPower 16', NULL, 'Pin Lưu Trữ Hithium Hero EE MaxPower 16
- Dung lượng: 16,08kWh
- Công nghệ Pin: Lithium Iron Phosphate
- Điện áp danh định: 51.2 VDC
- Dải điện áp sạc/xả (DOD): 100%
- Tuổi thọ pin: 11.000 chu kỳ sạc/xả.
- Dòng sạc/xả tối đa: 200A
- Giao tiếp & tích hợp inverter: CAN / RS485 / RS232
- Khả năng mở rộng : kết nối song song tối đa 16 pin, 
tổng dung lượng ~256kw
- Màn hình hiển thị: LCD Touchscreen
- Cấp bảo vệ: IP30 
Bảo Hiểm Cháy Nổ Toàn Cầu 10 Triệu USD

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: HITHIUM
BẢO HÀNH 10 NĂM 
1 ĐỔI 1', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('Hithium') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='hithium-battery-low-voltage'), 'hithium-hero-ee-maxpower-30', 'Hithium Hero EE MaxPower 30', NULL, 'Pin Lưu Trữ Hithium Hero EE MaxPower 30 
(Công nghệ cell pin mới 587Ah)
Dung lượng danh định: 30.05 kWh 
- Công nghệ pin: Lithium Iron Phosphate (LiFePO₄ – LFP) 
- Điện áp danh định: 51.2 VDC 
- Dải điện áp sạc/xả: 43.2 – 58.4 VDC 
- Độ sâu xả (DOD): 100% 
- Tuổi thọ pin: 11.000 chu kỳ sạc/xả 
- Dòng sạc/xả khuyến nghị: 260 A 
- Dòng sạc/xả tối đa: 300 A 
- Giao tiếp & tích hợp inverter: CAN / RS485 / RS232 
- Khả năng mở rộng: Kết nối song song tối đa 32 pin,
tổng dung lượng ~961 kWh 
- Màn hình hiển thị: LCD Touchscreen 
- Cấp bảo vệ: IP65
Bảo Hiểm Cháy Nổ Toàn Cầu 10 Triệu USD

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 10 năm

Ghi chú: HITHIUM
BẢO HÀNH 10 NĂM 
1 ĐỔI 1', 1) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('Dyness') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='dyness-battery-low-voltage'), 'dyness-dl5-0f', 'Dyness DL5.0F', 'DL5.0F', 'Thương hiệu: Dyness
Model No: DL5.0F
-Dung lượng: 5kwh, DOD 90%,Điện áp: 51.2V
-Dòng xạc/ xả liên tục (max): 50A (75A)
-Truyền thông: CAN2.0/ RS485/ RS232
-Cấp bảo vệ: IP20  
-Trọng lượng: 41kg
-Cell LFP: >=8000 cycles
-Có thể ghép song song lên tới 50 pack 
-Tương thích các dòng inverter: Solis, Luxpower, Growatt, Deye, Goodwe, Victron, Sofar, ...

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 07 năm

Ghi chú: DYNESS
BẢO HÀNH 07 NĂM', 0) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('Dyness') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='dyness-battery-low-voltage'), 'dyness-power-brick-sc', 'Dyness Power Brick SC', 'Power Brick SC', 'Thương hiệu: Dyness
Model No: Power Brick SC 
-Dung lượng: 16 kWh - DOD 95% 
-Điện áp: 51.2V - 314 Ah 
-Dòng xạc/ xả liên tục: 140 (max 200A) 
-Truyền thông: CAN2.0/ RS485
-Cấp bảo vệ: IP20   
-Trọng lượng: 116kg 
-Cell LFP: >=8000 cycles 
-Có thể ghép song song lên tới 50 pack 
-Tương thích các dòng inverter: Solis, Luxpower, Growatt, Deye, Goodwe, Victron, Sofar, .

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 07 năm

Ghi chú: DYNESS
BẢO HÀNH 07 NĂM', 1) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('Dyness') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='dyness-battery-low-voltage'), 'dyness-power-brick-plus', 'Dyness Power Brick PLUS', 'Power Brick PLUS', 'Thương hiệu: Dyness
Model No: Power Brick PLUS 
-Dung lượng: 16 kWh - DOD 95% 
-Điện áp: 51.2V - 314 Ah 
-Dòng xạc/ xả liên tục: 140 (max 200A) 
-Truyền thông: CAN2.0/ RS485
-Cấp bảo vệ: IP65  
-Trọng lượng: 116kg 
-Cell LFP: >=8000 cycles 
-Có thể ghép song song lên tới 50 pack 
-Tương thích các dòng inverter: Solis, Luxpower, Growatt, Deye, Goodwe, Victron, Sofar, .

Bảo hành tiêu chuẩn: Bảo hành tiêu chuẩn 07 năm

Ghi chú: DYNESS
BẢO HÀNH 07 NĂM', 2) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('Dyness') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='dyness-battery-low-voltage'), 'dyness-battery-module-14-3kwh', 'Dyness Battery Module 14.3kWh', NULL, 'Thương hiệu: Dyness (Lắp tối thiểu 6 pack) 
-1module/14.3Kwh/51.2V 280Ah/ ≥8000 Cycles/1C/ 
-Bảo hành 10 năm (theo tiêu chuẩn nhà sản xuất)

Bảo hành tiêu chuẩn: Bảo Hành 10 Năm Theo Tiêu Chuẩn Nhà Sản Xuất

Ghi chú: DYNESS
BẢO HÀNH 10 NĂM
THEO TIÊU CHUẨN NHÀ SẢN XUẤT', 3) ON CONFLICT (slug) DO UPDATE SET brand_id=EXCLUDED.brand_id, category_id=EXCLUDED.category_id, name=EXCLUDED.name, model_number=EXCLUDED.model_number, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order;
INSERT INTO products (brand_id, category_id, slug, name, model_number, description, sort_order) VALUES ((SELECT id FROM brands WHERE LOWER(name)=LOWER('Sungrow') ORDER BY id LIMIT 1), (SELECT id FROM categories WHERE slug='sungrow-battery-low-voltage'), 'sungrow-mbl160', 'Pin Lưu Trữ Sungrow MBL160', 'Tower T7', 'Pin Lưu Trữ Sungrow MBL160
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
