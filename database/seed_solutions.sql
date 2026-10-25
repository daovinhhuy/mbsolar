-- Idempotent starter records for the homepage carousel and solution detail pages.
BEGIN;

INSERT INTO images (path, alt_text) VALUES
    ('/image/background2.jpg', 'Giải pháp điện mặt trời cho hộ gia đình'),
    ('/image/backgroundMB1.jpg', 'Giải pháp điện mặt trời cho doanh nghiệp'),
    ('/image/background.jpg', 'Giải pháp lưu trữ năng lượng')
ON CONFLICT (path) DO NOTHING;

INSERT INTO solutions (title, introduction, content, sort_order)
SELECT seed.title, seed.introduction, seed.content, seed.sort_order
FROM (VALUES
    (
        'Giải pháp điện mặt trời cho hộ gia đình',
        'Giải pháp điện mặt trời áp mái được tư vấn theo diện tích mái, nhu cầu sử dụng điện và điều kiện lắp đặt của từng gia đình.',
        $$MB Solar khảo sát hiện trạng công trình và nhu cầu sử dụng để đề xuất cấu hình tấm pin, inverter và phương án vận hành phù hợp.

Hệ thống có thể được thiết kế theo hướng hòa lưới hoặc kết hợp pin lưu trữ, tùy theo điều kiện công trình và nhu cầu của gia đình.$$,
        0
    ),
    (
        'Giải pháp điện mặt trời cho doanh nghiệp',
        'Giải pháp cho nhà xưởng, tòa nhà và công trình thương mại được xây dựng dựa trên hiện trạng mái và nhu cầu sử dụng điện.',
        $$MB Solar xem xét kết cấu mái, biểu đồ phụ tải và điều kiện kết nối điện để tư vấn cấu hình hệ thống phù hợp với từng công trình.

Phạm vi thiết bị và phương án thi công được đề xuất theo quy mô dự án, điều kiện vận hành và yêu cầu của doanh nghiệp.$$,
        1
    ),
    (
        'Giải pháp điện mặt trời kết hợp lưu trữ',
        'Kết hợp hệ thống điện mặt trời với pin lưu trữ để chủ động hơn trong việc sử dụng nguồn điện tại công trình.',
        $$MB Solar tư vấn cấu hình pin lưu trữ, inverter và thiết bị đi kèm theo nhu cầu sử dụng điện cũng như điều kiện lắp đặt thực tế.

Phương án vận hành được lựa chọn theo mục đích sử dụng của khách hàng và khả năng tích hợp với hệ thống điện hiện có.$$,
        2
    )
) AS seed(title, introduction, content, sort_order)
WHERE NOT EXISTS (
    SELECT 1 FROM solutions AS existing WHERE existing.title = seed.title
);

INSERT INTO solution_images (solution_id, image_id, sort_order, is_primary)
SELECT solution.id, image.id, 0, TRUE
FROM (VALUES
    ('Giải pháp điện mặt trời cho hộ gia đình', '/image/background2.jpg'),
    ('Giải pháp điện mặt trời cho doanh nghiệp', '/image/backgroundMB1.jpg'),
    ('Giải pháp điện mặt trời kết hợp lưu trữ', '/image/background.jpg')
) AS seed(title, path)
JOIN solutions AS solution ON solution.title = seed.title
JOIN images AS image ON image.path = seed.path
ON CONFLICT (solution_id, image_id) DO NOTHING;

COMMIT;
