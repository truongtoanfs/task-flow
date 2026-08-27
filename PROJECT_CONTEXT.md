# TaskFlow — Project Context

## 1. Mục tiêu dự án

TaskFlow là dashboard quản lý dự án và công việc nội bộ.

Dự án được sử dụng để thực hành phát triển một ứng dụng full-stack từ giao diện, API đến cơ sở dữ liệu trong cùng một Nuxt application.

## 2. Trạng thái hiện tại

Đã hoàn thành:

- Khởi tạo Nuxt 4.
- Cấu hình giao diện chạy CSR bằng `ssr: false`.
- Cấu hình pnpm chỉ cho phép `esbuild` chạy build script.
- Kiểm tra ứng dụng chạy tại `http://localhost:3000`.
- Đã xác định phạm vi MVP.
- Đã xác định actor và vai trò `owner`, `member`, `viewer`.
- Đã viết business rule và acceptance criteria tại `docs/spec.md`.
- Đã thiết kế ERD và cardinality tại `docs/erd.md`.
- Đã xác định sáu entity của MVP.
- Đã xác định các quan hệ N–N và bảng nối.
- Đã xác định constraint dự kiến và rule cần service/transaction.
- Đã viết Data Dictionary cho sáu bảng của MVP.
- Đã chốt UUID, kiểu dữ liệu, nullability và default.
- Đã chốt primary key, foreign key, unique và check constraint.
- Đã chốt quy tắc ON DELETE RESTRICT.
- Đã xác định cột audit và metadata của activity log.
- Đã chọn PostgreSQL 17.11 cho TaskFlow.
- Đã cấu hình PostgreSQL bằng Docker Compose.
- Đã pin image `postgres:17.11-alpine3.24`.
- Đã cấu hình named volume `postgres_data`.
- Đã cấu hình healthcheck bằng `pg_isready`.
- Đã xác minh kết nối, timezone UTC và `gen_random_uuid()`.
- Đã xác minh dữ liệu tồn tại sau khi tạo lại container.
- Đã viết hướng dẫn tại `docs/database-setup.md`.

Chưa thực hiện:

- Chưa cài Drizzle ORM, PostgreSQL driver và Zod.
- Chưa ánh xạ Data Dictionary thành Drizzle schema.
- Chưa tạo hoặc chạy migration.
- Chưa tạo các bảng nghiệp vụ.
- Chưa kết nối Nuxt server với database.
- Chưa xây dựng API.
- Chưa có chức năng đăng nhập và phân quyền.
- Chưa có test.

AI không được coi các phần “chưa thực hiện” là đã tồn tại.

## 3. Công nghệ hiện tại

- Nuxt 4
- Vue 3
- TypeScript
- Nitro/H3
- pnpm
- CSR với `ssr: false`

Phiên bản chính xác phải được đọc từ:

- `package.json`
- `pnpm-lock.yaml`

Không tự suy đoán phiên bản thư viện.

## 4. Công nghệ dự kiến

Các công nghệ sau chưa được cài đặt ở thời điểm hiện tại:

- PostgreSQL
- Drizzle ORM
- Zod
- Element Plus hoặc BFC UI

Chỉ cài đặt khi đến đúng feature hoặc chặng triển khai.

## 5. Mô hình thực thi

### Trình duyệt

Các phần giao diện trong `app/` chạy ở trình duyệt:

- Page
- Component
- Layout
- Client state
- Gọi API

### Server

Các phần trong `server/` chạy trên Nitro server:

- API endpoint
- Validation phía server
- Business rule
- Phân quyền
- Transaction
- Truy vấn PostgreSQL

`ssr: false` chỉ tắt server-side rendering cho giao diện. Nó không tắt Nitro API server.

## 6. Kiến trúc dự kiến

Luồng phụ thuộc:

UI → API handler → service → repository → PostgreSQL

Trách nhiệm:

- `app/`: giao diện và tương tác người dùng
- `server/api/`: HTTP request và HTTP response
- `server/services/`: business rule, quyền và transaction
- `server/repositories/`: truy vấn dữ liệu
- `server/database/`: kết nối, schema và migration

Không import ngược chiều kiến trúc.

## 7. Quy tắc phát triển

- Sử dụng TypeScript.
- Không sử dụng `any` nếu chưa giải thích lý do.
- API handler phải mỏng.
- Không đặt business rule trực tiếp trong component.
- Không truy cập database từ code phía client.
- Dữ liệu từ người dùng phải được validate phía server.
- Không đặt secret trong `runtimeConfig.public`.
- Không commit file `.env`.
- Mọi thay đổi database sau này phải đi qua migration.
- Không tự tạo bảng, API hoặc business rule chưa được xác nhận.
- Không tuyên bố hoàn thành khi chưa chạy lệnh kiểm tra.

## 8. Quy tắc dependency

- Sử dụng pnpm.
- `pnpm-lock.yaml` phải được commit.
- Không tự ý tắt chính sách supply-chain của pnpm.
- Chỉ phê duyệt build script của dependency đã được kiểm tra.
- Hiện tại chỉ có `esbuild` được phép chạy build script.

## 9. Các lệnh hiện có

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```
Không ghi một lệnh vào tài liệu nếu lệnh đó chưa tồn tại hoặc chưa được kiểm tra.

## 10. Quyết định chưa chốt

Những nội dung sau phải được phân tích trước khi triển khai:

- API contract.
- Index tối ưu theo truy vấn.
- Authentication provider.
- Cấu hình database production.

Các quyết định đã chốt nằm tại:

- Đặc tả nghiệp vụ: `docs/spec.md`.
- ERD logic: `docs/erd.md`.
- Thiết kế dữ liệu chi tiết: `docs/data-dictionary.md`.
- Hạ tầng PostgreSQL local: `docs/database-setup.md`.

Nếu thiếu thông tin, phải đặt câu hỏi thay vì tự giả định.

## 11. Definition of Done hiện tại

Một thay đổi chỉ được xem là hoàn thành khi:

- Code chạy được.
- Build thành công.
- Không làm lộ secret.
- Không phá vỡ kiến trúc đã thống nhất.
- Tài liệu liên quan được cập nhật.
- Có bằng chứng về lệnh kiểm tra đã chạy.

## 12. Bằng chứng kiểm tra Buổi 1

Ngày kiểm tra: 2026-08-25

Môi trường:

- Node.js: `22.23.2`
- pnpm: `11.23.0`

Các lệnh đã chạy:

- `pnpm install --frozen-lockfile`: thành công
- `pnpm build`: thành công
- `pnpm dev`: ứng dụng chạy tại `http://localhost:3000`

Các nội dung đã xác nhận:

- Giao diện chạy CSR với `ssr: false`.
- Nitro development server vẫn hoạt động.
- Không có secret trong repository.
- README chỉ hướng dẫn sử dụng pnpm.

## 13. Bằng chứng kiểm tra Buổi 2

Ngày kiểm tra: 2026-08-25

Tài liệu:

- `docs/spec.md`

Đã xác nhận:

- Phạm vi MVP và ngoài phạm vi.
- Actor và vai trò.
- Ma trận phân quyền.
- Business rule `BR-01` đến `BR-14`.
- Acceptance criteria `AC-01` đến `AC-11`.
- Quy tắc xóa dữ liệu và cập nhật đồng thời.

Chưa thực hiện:

- Thiết kế ERD.
- Từ điển dữ liệu.
- Schema và migration.
- API implementation.

## 14. Bằng chứng kiểm tra Buổi 3

Ngày kiểm tra: 2026-08-26

Tài liệu:

- `docs/spec.md` phiên bản 1.1
- `docs/erd.md`

Đã xác nhận:

- Sáu entity thuộc phạm vi MVP.
- Cardinality và optionality.
- Hai quan hệ N–N có entity trung gian.
- Membership duy nhất theo project và user.
- Assignee phải thuộc cùng project với task.
- Constraint dự kiến.
- Business rule cần service hoặc transaction.

Chưa thực hiện:

- Từ điển dữ liệu.
- Schema Drizzle.
- Migration.
- PostgreSQL.

## 15. Bằng chứng kiểm tra Buổi 4

Ngày kiểm tra: 2026-08-26

Tài liệu:

- `docs/data-dictionary.md`
- `docs/erd.md`

Đã xác nhận:

- Kiểu khóa chính UUID.
- Kiểu dữ liệu PostgreSQL cho mọi cột.
- Nullability và default.
- Primary key, foreign key, unique và check constraint.
- Hai foreign key ghép bảo vệ assignee cùng project.
- Quy tắc ON DELETE RESTRICT.
- Cột audit và metadata activity log.
- Business rule cần service hoặc transaction.

Chưa thực hiện:

- PostgreSQL bằng Docker Compose.
- Drizzle schema.
- Migration.
- Index tối ưu truy vấn.
- API implementation.

## 16. Bằng chứng kiểm tra Buổi 5

Ngày kiểm tra: 2026-08-27

Cấu hình:

- PostgreSQL `17.11`.
- Docker image `postgres:17.11-alpine3.24`.
- Database `taskflow`.
- User local `taskflow`.
- Host binding `127.0.0.1`.
- Named volume `postgres_data`.
- Timezone UTC.

Đã xác nhận:

- `docker compose config --quiet` thành công.
- PostgreSQL chuyển sang trạng thái `healthy`.
- Có thể kết nối bằng `psql`.
- `current_database()` trả về `taskflow`.
- `current_user` trả về `taskflow`.
- `gen_random_uuid()` hoạt động.
- Dữ liệu vẫn tồn tại sau `docker compose down` và `up`.
- Database đã được trả về trạng thái trống sau bài kiểm tra.

Chưa thực hiện:

- Drizzle ORM.
- Schema TypeScript.
- Migration.
- Bảng nghiệp vụ.
- API database integration.
