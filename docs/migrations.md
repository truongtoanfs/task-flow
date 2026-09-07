# TaskFlow — Migration Workflow

## 1. Trạng thái

- Initial migration: Applied
- Migration file: `drizzle/0000_init_taskflow.sql`
- Database: PostgreSQL 17.11
- Ngày kiểm tra: 2026-08-27

## 2. Nguồn schema

Schema TypeScript:

- `server/database/schema.ts`

Cấu hình Drizzle:

- `drizzle.config.ts`

Migration history:

- `drizzle/meta/_journal.json`
- `drizzle/meta/0000_snapshot.json`

## 3. Generate migration

```bash
pnpm exec drizzle-kit generate --name=<migration_name>
```

`generate` chỉ tạo file migration và snapshot. Nó không thay đổi database.

## 4. Review migration

Trước khi apply phải kiểm tra:

- Các bảng được tạo hoặc thay đổi.
- Primary key.
- Foreign key.
- Unique constraint.
- Check constraint.
- Default value.
- Nullability.
- Quy tắc `ON DELETE`.
- Các câu lệnh có nguy cơ làm mất dữ liệu.

## 5. Apply migration

```bash
pnpm db:migrate
```

Migration chỉ được apply sau khi SQL đã được review.

## 6. Quy tắc migration

- Không dùng `drizzle-kit push` trong workflow chính.
- Không sửa migration đã được apply.
- Không xóa hoặc đổi tên migration đã commit.
- Không sửa thủ công snapshot hoặc journal.
- Mọi thay đổi schema mới phải có migration mới.
- Migration phải được kiểm tra trên database sạch.
- Migration phải được commit cùng thay đổi schema liên quan.

## 7. Initial migration

Initial migration tạo sáu bảng:

- `users`
- `projects`
- `project_members`
- `tasks`
- `task_assignees`
- `activity_logs`

Đã xác nhận:

- 6 primary key.
- 12 foreign key.
- 1 unique constraint riêng.
- 15 check constraint.
- 12 foreign key sử dụng `ON DELETE RESTRICT`.
- Không tạo PostgreSQL enum.