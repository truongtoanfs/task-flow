# TaskFlow

TaskFlow là dashboard quản lý dự án và công việc nội bộ.

Dự án được xây dựng để thực hành phát triển một ứng dụng full-stack từ giao diện, API đến cơ sở dữ liệu trong cùng một Nuxt application.

## Trạng thái hiện tại

Đã hoàn thành:

- Khởi tạo Nuxt 4.
- Cấu hình giao diện chạy CSR bằng `ssr: false`.
- Cấu hình pnpm và lockfile.
- Tạo `PROJECT_CONTEXT.md`.
- Kiểm tra cài đặt, build và development server.

Chưa thực hiện:

- Phân tích đầy đủ business rule.
- Thiết kế ERD và cơ sở dữ liệu.
- PostgreSQL và Docker Compose.
- Drizzle ORM và Zod.
- API.
- Đăng nhập và phân quyền.
- Test.

Xem trạng thái và quy tắc dự án tại [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md).

## Công nghệ hiện tại

- Nuxt 4
- Vue 3
- TypeScript
- Nitro/H3
- pnpm
- CSR với `ssr: false`

Các công nghệ dự kiến nhưng chưa cài đặt:

- PostgreSQL
- Drizzle ORM
- Zod
- Element Plus hoặc BFC UI

## Yêu cầu môi trường

- Node.js từ phiên bản 22.19.0
- pnpm theo phiên bản được khai báo trong `package.json`
- Git

Docker sẽ được yêu cầu từ giai đoạn PostgreSQL.

## Cài đặt

Clone repository:

```bash
git clone https://github.com/truongtoanfs/task-flow.git
cd task-flow

```

Cài dependency đúng theo lockfile:

```bash
pnpm install --frozen-lockfile
```

## Chạy development server

```bash
pnpm dev
```

Mở ứng dụng tại:

```text
http://localhost:3000
```

## Build production

```bash
pnpm build
```

Chạy thử bản production:

```bash
pnpm preview
```

## Kiến trúc dự kiến

```text
UI
→ API handler
→ service
→ repository
→ PostgreSQL
```

Trách nhiệm:

- `app/`: giao diện và tương tác người dùng.
- `server/api/`: HTTP request và HTTP response.
- `server/services/`: business rule, quyền và transaction.
- `server/repositories/`: truy vấn dữ liệu.
- `server/database/`: kết nối, schema và migration.

Các thư mục server sẽ được tạo khi dự án triển khai đến đúng giai đoạn.

## Quy tắc phát triển

- Chỉ sử dụng pnpm.
- Không commit `.env`.
- Không đặt secret trong `runtimeConfig.public`.
- Không truy cập database từ code client.
- Validate dữ liệu người dùng phía server.
- Thay đổi database phải đi qua migration.
- Không tuyên bố hoàn thành nếu chưa chạy lệnh kiểm tra.

## Lộ trình gần nhất

1. Hoàn thành thiết lập repository.
2. Viết đặc tả MVP và business rule.
3. Thiết kế ERD.
4. Viết từ điển dữ liệu.
5. Dựng PostgreSQL bằng Docker Compose.