# TaskFlow

TaskFlow là dashboard quản lý dự án và công việc nội bộ.

Dự án được xây dựng để thực hành phát triển một ứng dụng full-stack từ giao diện, API đến cơ sở dữ liệu trong cùng một Nuxt application.

## Trạng thái hiện tại

Đã hoàn thành:

- Khởi tạo Nuxt 4 chạy ở chế độ CSR.
- Phân tích phạm vi MVP và business rule.
- Thiết kế ERD và Data Dictionary.
- Dựng PostgreSQL 17.11 bằng Docker Compose.
- Khai báo sáu bảng bằng Drizzle ORM.
- Generate và review initial migration.
- Apply migration thành công trên PostgreSQL local.
- Kiểm tra primary key, foreign key, unique và check constraint.
- Tạo bộ seed data ổn định cho local development và test.
- Đã kiểm tra seed chạy lặp không tạo dữ liệu trùng.
- Chuẩn hóa Zod validation cho task API.
- Chuẩn hóa success và error response.
- Thêm unit test cho validation và error handling.
- Đã kết nối Nuxt server với PostgreSQL bằng Drizzle.
- Đã triển khai development authentication context.
- Đã triển khai authorization tạo task.
- Đã triển khai `POST /api/projects/:projectId/tasks`.
- Owner và member được tạo task; viewer bị từ chối.
- Tạo task và activity log trong cùng transaction.
- Khóa membership trong quá trình kiểm tra quyền tạo task.

Tài liệu:

- [Đặc tả MVP](./docs/spec.md)
- [ERD](./docs/erd.md)
- [Data Dictionary](./docs/data-dictionary.md)
- [Thiết lập PostgreSQL](./docs/database-setup.md)
- [Quy trình migration](./docs/migrations.md)
- [Seed data](./docs/seed-data.md)
- [API conventions](./docs/api-conventions.md)
- [Create Task API](./docs/task-create-api.md)

Chưa thực hiện:

- Session authentication thật.
- Các API ngoài chức năng tạo task.
- Integration test tự động.
- Index tối ưu truy vấn.

## Công nghệ hiện tại

- Nuxt 4
- Vue 3
- TypeScript
- Nitro/H3
- pnpm
- PostgreSQL 17.11
- Docker Compose
- Drizzle ORM
- Drizzle Kit
- postgres.js
- Zod
- CSR với `ssr: false`

## Yêu cầu môi trường

- Node.js từ phiên bản 22.19.0
- pnpm theo phiên bản được khai báo trong `package.json`
- Git

Docker Compose được sử dụng để chạy PostgreSQL local.

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
## Database local

Tạo file môi trường:

```bash
cp .env.example .env
```

## Khởi động PostgreSQL
```bash
docker compose up -d
docker compose ps
```

## Apply các migration chưa chạy
```bash
pnpm db:migrate
```

### Nạp dữ liệu mẫu

```bash
pnpm db:seed
```

## Generate migration mới sau khi thay đổi Drizzle schema
```bash
pnpm db:generate --name=<migration_name>
```

## Chạy unit test

```bash
pnpm test
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

Các thư mục server hiện được tổ chức theo kiến trúc trên.

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
