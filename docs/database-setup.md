# TaskFlow — Local Database Setup

## 1. Trạng thái tài liệu

- Trạng thái: Verified Local Infrastructure
- Phiên bản: 1.0
- Ngày tạo: 2026-08-27
- Phạm vi: PostgreSQL local development
- Thiết kế dữ liệu: [data-dictionary.md](./data-dictionary.md)

## 2. Quyết định kỹ thuật

- Database engine: PostgreSQL.
- PostgreSQL version: 17.11.
- Docker image: `postgres:17.11-alpine3.24`.
- Container orchestration: Docker Compose.
- Host binding: `127.0.0.1`.
- Container port: `5432`.
- Default host port: `5432`.
- Database name: `taskflow`.
- Named volume: `postgres_data`.
- Database timezone: UTC.
- Readiness check: `pg_isready`.

## 3. Các file cấu hình

- `compose.yaml`: định nghĩa PostgreSQL service và volume.
- `.env.example`: mẫu biến môi trường được commit.
- `.env`: cấu hình local, không được commit.

## 4. Khởi động

```bash
cp .env.example .env
docker compose config --quiet
docker compose pull
docker compose up -d
docker compose ps
```

PostgreSQL phải chuyển sang trạng thái `healthy`.

## 5. Kiểm tra kết nối

```bash
docker compose exec postgres sh -c \
  'PGPASSWORD="$POSTGRES_PASSWORD" psql -h 127.0.0.1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT current_database(), current_user;"'
```

Kết quả phải xác nhận:

- Database: `taskflow`.
- User: `taskflow`.

## 6. Kiểm tra UUID

```bash
docker compose exec postgres sh -c \
  'PGPASSWORD="$POSTGRES_PASSWORD" psql -h 127.0.0.1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT gen_random_uuid();"'
```

## 7. Dừng database

Dừng và giữ container:

```bash
docker compose stop
```

Xóa container nhưng giữ named volume:

```bash
docker compose down
```

## 8. Cảnh báo reset dữ liệu

Lệnh sau xóa toàn bộ dữ liệu local:

```bash
docker compose down -v
```

Chỉ sử dụng khi chủ động muốn khởi tạo lại database từ đầu.

## 9. Quy tắc biến môi trường

- Không commit `.env`.
- `.env.example` không chứa bí mật production.
- Nếu đổi password, phải đồng bộ `POSTGRES_PASSWORD` và `DATABASE_URL`.
- Các biến `POSTGRES_*` chỉ khởi tạo database khi volume còn trống.
- Không ghi password thật vào tài liệu, source code hoặc commit.

## 10. Phạm vi chưa thực hiện

- Chưa cài Drizzle ORM.
- Chưa viết schema TypeScript.
- Chưa tạo migration.
- Chưa tạo sáu bảng nghiệp vụ.
- Chưa tạo index tối ưu truy vấn.
- Chưa kết nối Nuxt với PostgreSQL.
- Chưa thiết kế cấu hình database production.
