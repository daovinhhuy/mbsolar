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

-- Store the six ordered image/content slots directly on each solution row.
UPDATE solutions AS solution
SET
    title = seed.title,
    introduction = seed.introduction,
    content = concat_ws(E'\n\n', seed.content_1, seed.content_2, seed.content_3, seed.content_4, seed.content_5, seed.content_6),
    image_1 = seed.image_1,
    content_1 = seed.content_1,
    image_2 = seed.image_2,
    content_2 = seed.content_2,
    image_3 = seed.image_3,
    content_3 = seed.content_3,
    image_4 = seed.image_4,
    content_4 = seed.content_4,
    image_5 = seed.image_5,
    content_5 = seed.content_5,
    image_6 = seed.image_6,
    content_6 = seed.content_6,
    sort_order = seed.sort_order
FROM (VALUES
    (
        'Giải pháp điện mặt trời cho doanh nghiệp',
        'Tổng thầu EPC Điện mặt trời',
        'MB Solar cung cấp giải pháp tổng thầu EPC trọn gói từ khảo sát, thiết kế và cung cấp thiết bị đến thi công, nghiệm thu công trình.',
        '/image/backgroundMB1.jpg',
        'Khảo sát hiện trạng công trình, mái và nhu cầu sử dụng điện để xác định phương án phù hợp.',
        'Thiết kế hệ thống và hồ sơ kỹ thuật theo điều kiện vận hành của dự án.',
        'Lựa chọn tấm pin, inverter và thiết bị đồng bộ theo yêu cầu công trình.',
        'Thi công, lắp đặt và đấu nối hệ thống theo thiết kế được thống nhất.',
        'Kiểm tra, chạy thử và nghiệm thu các hạng mục trước khi bàn giao.',
        'Hướng dẫn vận hành và hỗ trợ kỹ thuật sau khi hệ thống đi vào hoạt động.',
        NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 0
    ),
    (
        'Giải pháp điện mặt trời kết hợp lưu trữ',
        'Lắp đặt điện mặt trời cho khu công nghiệp',
        'Giải pháp cho nhà xưởng và khu công nghiệp được thiết kế theo hiện trạng mái, biểu đồ phụ tải và yêu cầu vận hành của doanh nghiệp.',
        '/image/background.jpg',
        'Khảo sát mái nhà xưởng, kết cấu chịu lực và điều kiện tiếp cận thi công.',
        'Phân tích nhu cầu điện và biểu đồ phụ tải theo hoạt động của nhà máy.',
        'Đề xuất công suất, hướng lắp đặt và cấu hình hệ thống phù hợp.',
        'Lắp đặt khung giá đỡ, tấm pin và thiết bị chuyển đổi điện.',
        'Đấu nối, kiểm tra an toàn và chạy thử hệ thống theo phương án kỹ thuật.',
        'Bàn giao hồ sơ, hướng dẫn theo dõi sản lượng và hỗ trợ vận hành.',
        NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 1
    ),
    (
        'Giải pháp điện mặt trời cho hộ gia đình',
        'Lắp đặt điện mặt trời cho hộ gia đình',
        'Hệ thống điện mặt trời gia đình được tư vấn theo diện tích mái, hóa đơn điện, nhu cầu sử dụng và điều kiện lắp đặt thực tế.',
        '/image/background2.jpg',
        'Khảo sát mái nhà và trao đổi với gia đình về mức tiêu thụ điện.',
        'Tính toán công suất hệ thống phù hợp với nhu cầu sử dụng hằng ngày.',
        'Tư vấn vị trí lắp đặt tấm pin để tận dụng tốt diện tích mái.',
        'Lắp đặt inverter, tủ điện và các thiết bị bảo vệ cần thiết.',
        'Kiểm tra đấu nối, cấu hình và hướng dẫn gia đình sử dụng hệ thống.',
        'Theo dõi hoạt động và hỗ trợ kỹ thuật sau khi bàn giao.',
        NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 2
    )
) AS seed(
    old_title, title, introduction, image_1,
    content_1, content_2, content_3, content_4, content_5, content_6,
    image_2, image_3, image_4, image_5, image_6, sort_order
)
WHERE solution.title IN (seed.old_title, seed.title);

COMMIT;
