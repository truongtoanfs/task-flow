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

