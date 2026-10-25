# PostgreSQL cho MB Solar

## Mô hình theo source hiện tại

- `data/products.ts`, `data/inverterSolaX.ts`, `data/solarStorage.ts` và `data/solarAccessories.ts` chứa dữ liệu sản phẩm/catalog.
- `partners` chứa thông tin hiển thị và nội dung giới thiệu của các đối tác. Danh sách sản phẩm trên trang đối tác được lọc theo thương hiệu trong `brands`.
- `app/finished-construction/projects.ts` chỉ khai báo kiểu dữ liệu; danh sách công trình được đọc từ `construction_projects` và ảnh từ `construction_project_images`.
- `solutions` lưu tiêu đề, giới thiệu, nội dung, thứ tự và trạng thái hiển thị của từng giải pháp; `solution_images` liên kết ảnh từ bảng dùng chung `images`.
- API `GET /api/solutions` trả về các giải pháp đã xuất bản. Trang chủ và trang chi tiết tải dữ liệu qua `services/solutionsCatalog.ts`.
- Website hiện chưa hiển thị giá cụ thể và chưa có tồn kho, tài khoản, giỏ hàng, đơn hàng hay form tư vấn.

## Bảng

- `brands`: tên thương hiệu và trạng thái hoạt động, được liên kết với sản phẩm.
- `partners`: dữ liệu trang đối tác gồm tên, logo, ảnh hồ sơ, website và nội dung giới thiệu; `id` giữ nguyên các URL đối tác hiện tại.
- `partner_profiles`: hồ sơ nội dung gắn với `brands` theo schema hiện tại.
- `categories`: danh mục cha/con và `filter_key` để lọc catalog.
- `products`: sản phẩm thuộc một thương hiệu và một danh mục, có `slug`, tên, mã model tùy chọn, mô tả Markdown và nhãn tự do (`badge`, ví dụ “Hiệu suất cao”, “N-type”). `is_new` đánh dấu sản phẩm mới; `is_best_seller` đánh dấu sản phẩm bán chạy.
- `products.description`: nội dung mô tả Markdown để hiển thị nguyên văn theo đoạn/danh sách và giữ định dạng như chữ đậm.
- `categories.filter_key`: khóa lọc catalog của danh mục con; không lặp lại khóa này trên mỗi sản phẩm.
- `construction_projects`: tiêu đề, giới thiệu, nội dung dài dạng text và đường dẫn ảnh. Giao diện có thể tự chèn ảnh vào nội dung tại vị trí theo số ký tự mà không cần bảng nội dung con.
- `quote_requests`: bảng dự phòng cho yêu cầu tư vấn khi website có form.

Quan hệ chính:

```text
brands 1 ─── N products
brands 1 ─── 0..1 partner_profiles
partners: danh sách hồ sơ đối tác độc lập, giữ ID URL hiện tại
categories 1 ─── N products
categories 1 ─── N categories (danh mục con)
products 1 ─── N quote_requests (sản phẩm quan tâm là tùy chọn)
```

Trang chủ đọc công trình đã làm từ `construction_projects` và giải pháp từ `solutions`; menu và banner tĩnh vẫn khai báo trong code. Schema chưa có bảng quản lý vị trí nội dung trang chủ.

## Cập nhật database hiện có cho Giải pháp

Chạy migration và nạp ba nội dung khởi đầu từ thư mục gốc dự án:

```powershell
psql -U postgres -d mb_solar -v ON_ERROR_STOP=1 -f database/migrate_solutions.sql
psql -U postgres -d mb_solar -v ON_ERROR_STOP=1 -f database/seed_solutions.sql
```

Hai lệnh có thể chạy lại an toàn. Nội dung và ảnh được lưu trong PostgreSQL; có thể sửa hoặc thêm bản ghi trong bảng `solutions`, `solution_images` và `images`.

## Tạo database mới

Với database hiện có, thêm các cờ sản phẩm mới/bán chạy bằng migration:

```powershell
psql -U postgres -d mb_solar -v ON_ERROR_STOP=1 -f database/migration_product_home_sections.sql
```

Cần PostgreSQL 13 trở lên và có `createdb`/`psql` trong PATH. Từ thư mục gốc dự án, chạy:

```powershell
createdb -U postgres mb_solar
psql -U postgres -d mb_solar -v ON_ERROR_STOP=1 -f database/schema.sql
psql -U postgres -d mb_solar -v ON_ERROR_STOP=1 -f database/seed_partners.sql
psql -U postgres -d mb_solar -v ON_ERROR_STOP=1 -f database/seed_solax.sql
psql -U postgres -d mb_solar -v ON_ERROR_STOP=1 -f database/seed_inverter_categories.sql
```

Nếu tài khoản PostgreSQL không phải `postgres`, thay tên đó bằng user tương ứng. Với PostgreSQL managed, tạo database trong nhà cung cấp rồi chạy schema bằng connection string của họ.

Khi tích hợp driver/ORM vào ứng dụng, đặt connection string trong `.env.local` (không commit file này):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mb_solar"
```

Schema này dành cho database mới; `CREATE TABLE IF NOT EXISTS` không tự cập nhật cấu trúc của database đã khởi tạo từ schema phiên bản cũ. Danh sách đối tác được nạp bằng `database/seed_partners.sql` và API `/api/partners` đọc trực tiếp từ bảng `partners`.
