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
- Đã cài Drizzle ORM, Drizzle Kit, PostgreSQL driver, dotenv và Zod.
- Đã tạo cấu hình Drizzle tại `drizzle.config.ts`.
- Đã ánh xạ Data Dictionary thành `server/database/schema.ts`.
- Đã khai báo đủ sáu bảng của MVP.
- Đã khai báo primary key, foreign key, unique và check constraint.
- Đã khai báo hai khóa ngoại ghép của `task_assignees`.
- Đã khai báo khóa ngoại ghép của `activity_logs`.
- Đã khai báo check constraint cho cấu trúc activity log.
- Đã xuất và review SQL DDL bằng `pnpm db:export`.
- Đã generate initial migration `drizzle/0000_init_taskflow.sql`.
- Đã review SQL của initial migration.
- Đã apply migration vào PostgreSQL local.
- Đã tạo đủ sáu bảng nghiệp vụ.
- Đã xác minh 6 primary key, 12 foreign key, 1 unique và 15 check constraint.
- Đã xác minh mọi foreign key sử dụng `ON DELETE RESTRICT`.
- Đã xác minh migration chạy lần hai không tạo thay đổi trùng.
- Đã viết quy trình migration tại `docs/migrations.md`.
- Đã tạo seed tại `server/database/seed.ts`.
- Đã tạo đủ owner, member, viewer và outsider.
- Đã tạo project, task, assignee và activity log mẫu.
- Đã chuẩn bị dữ liệu phục vụ kiểm tra quyền, filter và trường hợp biên.
- Đã xác minh seed chạy lặp không tạo dữ liệu trùng.
- Đã tạo Zod schema cho params, query và task body.
- Đã sử dụng strict object để từ chối field lạ.
- Đã chuẩn hóa success response và error response.
- Đã chốt HTTP status và error code.
- Đã tạo helper validation và API handler.
- Đã thêm unit test bằng Vitest.
- Đã kết nối Nuxt server với PostgreSQL bằng Drizzle.
- Đã tạo development actor phía server.
- Đã tạo repository truy vấn membership và insert task.
- Đã triển khai service kiểm tra quyền tạo task.
- Đã triển khai `POST /api/projects/:projectId/tasks`.
- Đã trả response thành công với HTTP 201.
- Đã thêm unit test cho authentication context và authorization.
- Đã tạo activity-log repository.
- Đã tạo task và activity log trong cùng transaction.
- Đã khóa membership khi kiểm tra quyền tạo task.
- Đã xác minh activity log `task_created` tham chiếu đúng task.
- Đã xác minh rollback không để lại task khi thao tác sau thất bại.

Chưa thực hiện:

- Chưa có session authentication thật.
- Chưa có integration test tự động cho API.
- Chưa tạo index tối ưu truy vấn.

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

## 4. Công nghệ chưa triển khai

- Element Plus hoặc BFC UI.
- Authentication provider.
- Hạ tầng database production.

PostgreSQL, Drizzle ORM và Zod đã được cài đặt.

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
pnpm db:export
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm test
```
Không ghi một lệnh vào tài liệu nếu lệnh đó chưa tồn tại hoặc chưa được kiểm tra.

## 10. Quyết định chưa chốt

Những nội dung sau phải được phân tích trước khi triển khai:

- Các endpoint contract ngoài API tạo task.
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

## 17. Bằng chứng kiểm tra Buổi 6

Ngày kiểm tra: 2026-08-27

File triển khai:

- `drizzle.config.ts`
- `server/database/schema.ts`
- `docs/data-dictionary.md`

Packages:

- `drizzle-orm`
- `drizzle-kit`
- `postgres`
- `dotenv`
- `zod`

Đã xác nhận:

- Schema có đúng sáu bảng MVP.
- UUID sinh bằng `gen_random_uuid()`.
- Thời điểm dùng `timestamp with time zone`.
- Default thời gian là `now()`.
- Giá trị hữu hạn dùng `text + CHECK`.
- Có đủ primary key đơn và khóa ghép.
- Có đủ foreign key đơn và khóa ghép.
- Mọi foreign key sử dụng `ON DELETE RESTRICT`.
- `activity_logs.metadata` là `jsonb` object.
- Quy tắc `task_id` và `target_user_id` được bảo vệ bằng CHECK.
- `pnpm db:export` thành công.
- `pnpm build` thành công.
- PostgreSQL chưa có bảng nghiệp vụ.
- Chưa có migration được tạo.

Chưa thực hiện:

- Generate migration.
- Apply migration.
- Database client cho Nuxt.
- API implementation.

## 18. Bằng chứng kiểm tra Buổi 7

Ngày kiểm tra: 2026-08-27

Migration:

- `drizzle/0000_init_taskflow.sql`
- `drizzle/meta/0000_snapshot.json`
- `drizzle/meta/_journal.json`

Đã xác nhận:

- Initial migration được generate từ Drizzle schema.
- Migration có đúng sáu `CREATE TABLE`.
- Migration có 6 primary key.
- Migration có 12 foreign key.
- Migration có 1 unique constraint riêng.
- Migration có 15 check constraint.
- Tất cả foreign key sử dụng `ON DELETE RESTRICT`.
- Không có PostgreSQL enum.
- Không có lệnh xóa bảng hoặc xóa cột.
- Migration đã apply thành công.
- PostgreSQL có đúng sáu bảng nghiệp vụ.
- Drizzle migration history có đúng một bản ghi.
- Chạy lại migrate không tạo thay đổi trùng.
- Các bảng nghiệp vụ chưa có dữ liệu.
- `pnpm build` thành công.

Chưa thực hiện:

- Seed data.
- Nuxt database client.
- API implementation.

## 19. Bằng chứng kiểm tra Buổi 8

File triển khai:

- `server/database/seed.ts`
- `docs/seed-data.md`

Đã xác nhận:

- Seed chạy bằng Drizzle ORM và postgres.js.
- Seed chạy trong một transaction.
- UUID của dữ liệu mẫu là cố định.
- Seed sử dụng `onConflictDoNothing()`.
- Có đủ role owner, member và viewer.
- Có outsider không thuộc project.
- Có đủ status và priority của task.
- Có task không assignee và task có nhiều assignee.
- Có title đúng giới hạn 200 ký tự.
- Seed lần đầu thành công.
- Seed lần hai không tăng số dòng.
- `pnpm build` thành công.
- Không thay đổi schema hoặc migration.

Chưa thực hiện:

- Validation convention.
- API contract.
- Nuxt database client.
- API implementation.
- Authentication và authorization.
- Test tự động.

## 20. Bằng chứng kiểm tra Buổi 9

File triển khai:

- `server/contracts/api.ts`
- `server/utils/api-error.ts`
- `server/utils/api-handler.ts`
- `server/utils/request-validation.ts`
- `server/validation/task.ts`
- `docs/api-conventions.md`

Đã xác nhận:

- Params, query và body có Zod schema.
- Strict object từ chối field lạ.
- Title được trim và giới hạn 200 ký tự.
- Description rỗng được chuyển thành NULL.
- Status và priority chỉ nhận giá trị hợp lệ.
- Pagination được coerce và giới hạn.
- Update task bắt buộc có version.
- Validation error trả về 422.
- Malformed request được quy ước là 400.
- Error response không lộ SQL hoặc stack trace.
- Có 3 test files và 16 test cases.
- `pnpm test` thành công.
- `pnpm build` thành công.

Chưa thực hiện:

- API endpoint.
- Nuxt database client.
- Authentication và authorization.
- Service và repository.
- Transaction nghiệp vụ.
- Integration test.

## 21. Bằng chứng kiểm tra Buổi 10

File triển khai:

- `server/database/client.ts`
- `server/middleware/development-auth.ts`
- `server/utils/current-actor.ts`
- `server/repositories/project-member-repository.ts`
- `server/repositories/task-repository.ts`
- `server/services/task-service.ts`
- `server/api/projects/[projectId]/tasks.post.ts`
- `docs/task-create-api.md`

Đã xác nhận:

- Database client sử dụng Drizzle và postgres.js.
- Actor được lấy từ server context.
- Không nhận actor ID hoặc created-by từ client.
- Owner và member được tạo task.
- Viewer nhận `403 FORBIDDEN`.
- Outsider nhận `404 RESOURCE_NOT_FOUND`.
- Validation không hợp lệ trả `422 VALIDATION_ERROR`.
- Request thành công trả `201 Created`.
- Task được lưu trong PostgreSQL.
- Có 5 test files và 22 test cases.
- `pnpm test` thành công.
- `pnpm build` thành công.
- Không thay đổi schema hoặc migration.

Chưa thực hiện:

- Session authentication thật.
- Transaction tạo task và activity log.
- Integration test tự động.

## 22. Bằng chứng kiểm tra Buổi 11

File triển khai:

- `server/database/client.ts`
- `server/repositories/project-member-repository.ts`
- `server/repositories/task-repository.ts`
- `server/repositories/activity-log-repository.ts`
- `server/services/task-service.ts`
- `server/services/task-service.test.ts`
- `docs/task-create-api.md`

Đã xác nhận:

- Database và transaction sử dụng chung kiểu executor.
- Membership được đọc bằng `FOR UPDATE`.
- Membership check nằm trong transaction.
- Task được insert trước activity log.
- Activity log sử dụng action `task_created`.
- Activity log tham chiếu đúng project, actor và task.
- Task và activity log được commit cùng nhau.
- Thao tác lỗi rollback toàn bộ transaction.
- Rollback test không để lại task.
- Có 5 test files và 23 test cases.
- `pnpm test` thành công.
- `pnpm build` thành công.
- Không thay đổi schema hoặc migration.

Chưa thực hiện:

- Session authentication thật.
- Integration test tự động.
