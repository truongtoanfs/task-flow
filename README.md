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

Tài liệu:

- [Đặc tả MVP](./docs/spec.md)
- [ERD](./docs/erd.md)
- [Data Dictionary](./docs/data-dictionary.md)
- [Thiết lập PostgreSQL](./docs/database-setup.md)
- [Quy trình migration](./docs/migrations.md)

Chưa thực hiện:

- Seed data.
- Database client cho Nuxt server.
- API.
- Đăng nhập và phân quyền.
- Test tự động.
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

## Generate migration mới sau khi thay đổi Drizzle schema
```bash
pnpm db:generate --name=<migration_name>
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
