# TaskFlow — Data Dictionary

## 1. Trạng thái tài liệu

- Trạng thái: Implemented in Drizzle Schema
- Phiên bản: 1.1
- Ngày tạo: 2026-08-26
- Ngày cập nhật: 2026-08-27
- Phạm vi: TaskFlow MVP
- Nguồn nghiệp vụ: [spec.md](./spec.md)
- Nguồn mô hình logic: [erd.md](./erd.md)
- Schema vật lý: [schema.ts](../server/database/schema.ts)

## 2. Mục tiêu

Tài liệu xác định thiết kế dữ liệu chi tiết của TaskFlow MVP:

- Kiểu dữ liệu PostgreSQL.
- Nullability.
- Default value.
- Primary key, foreign key, unique và check constraint.
- Quy tắc ON DELETE.
- Cột audit.
- Phân chia trách nhiệm giữa database và service.

Tài liệu chưa triển khai schema Drizzle, migration hoặc index tối ưu truy vấn.

## 3. Quy ước chung

- Tên bảng và cột sử dụng `snake_case`.
- ID của entity chính sử dụng `uuid`.
- ID được tạo bằng `gen_random_uuid()`.
- Thời điểm sử dụng `timestamptz`.
- Thời điểm tạo mặc định là `now()`.
- `updated_at` phải được service cập nhật khi bản ghi thay đổi.
- Chuỗi bắt buộc phải được trim trước khi lưu.
- Chuỗi tùy chọn rỗng phải được chuyển thành `NULL`.
- Giá trị hữu hạn sử dụng `text` kết hợp `CHECK`.
- Mọi foreign key trong MVP sử dụng `ON DELETE RESTRICT`.
- Không thêm index tối ưu hiệu năng trong Buổi 4.

## 4. Bảng `users`

Lưu người sử dụng TaskFlow.

| Cột | Kiểu PostgreSQL | NULL | Default | Ràng buộc | Ý nghĩa |
|---|---|:---:|---|---|---|
| `id` | `uuid` | Không | `gen_random_uuid()` | Primary key | Định danh user |
| `display_name` | `text` | Không | Không | Dài 1–100 ký tự sau trim | Tên hiển thị |
| `created_at` | `timestamptz` | Không | `now()` | | Thời điểm tạo |
| `updated_at` | `timestamptz` | Không | `now()` | | Thời điểm cập nhật gần nhất |

### Constraint

- `PRIMARY KEY (id)`
- `CHECK (display_name = btrim(display_name))`
- `CHECK (char_length(display_name) BETWEEN 1 AND 100)`

## 5. Bảng `projects`

Lưu thông tin project.

| Cột | Kiểu PostgreSQL | NULL | Default | Ràng buộc | Ý nghĩa |
|---|---|:---:|---|---|---|
| `id` | `uuid` | Không | `gen_random_uuid()` | Primary key | Định danh project |
| `name` | `text` | Không | Không | Dài 1–120 ký tự | Tên project |
| `description` | `text` | Có | Không | Tối đa 5.000 ký tự | Mô tả project |
| `created_by` | `uuid` | Không | Không | FK tới `users.id` | Người tạo project |
| `created_at` | `timestamptz` | Không | `now()` | | Thời điểm tạo |
| `updated_at` | `timestamptz` | Không | `now()` | | Thời điểm cập nhật |

### Constraint

- `PRIMARY KEY (id)`
- `FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT`
- `CHECK (name = btrim(name))`
- `CHECK (char_length(name) BETWEEN 1 AND 120)`
- `CHECK (description IS NULL OR char_length(description) BETWEEN 1 AND 5000)`

## 6. Bảng `project_members`

Biểu diễn quan hệ giữa user và project, đồng thời lưu role của user trong project.

| Cột | Kiểu PostgreSQL | NULL | Default | Ràng buộc | Ý nghĩa |
|---|---|:---:|---|---|---|
| `project_id` | `uuid` | Không | Không | PK, FK | Project |
| `user_id` | `uuid` | Không | Không | PK, FK | Thành viên |
| `role` | `text` | Không | Không | CHECK | Vai trò trong project |
| `joined_at` | `timestamptz` | Không | `now()` | | Thời điểm tham gia |
| `updated_at` | `timestamptz` | Không | `now()` | | Thời điểm role thay đổi gần nhất |

### Constraint

- `PRIMARY KEY (project_id, user_id)`
- `FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT`
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT`
- `CHECK (role IN ('owner', 'member', 'viewer'))`

## 7. Bảng `tasks`

Lưu công việc thuộc project.

| Cột | Kiểu PostgreSQL | NULL | Default | Ràng buộc | Ý nghĩa |
|---|---|:---:|---|---|---|
| `id` | `uuid` | Không | `gen_random_uuid()` | Primary key | Định danh task |
| `project_id` | `uuid` | Không | Không | FK | Project chứa task |
| `created_by` | `uuid` | Không | Không | FK | User tạo task |
| `title` | `text` | Không | Không | Dài 1–200 ký tự | Tiêu đề |
| `description` | `text` | Có | Không | Tối đa 10.000 ký tự | Mô tả |
| `status` | `text` | Không | `'todo'` | CHECK | Trạng thái |
| `priority` | `text` | Không | `'medium'` | CHECK | Độ ưu tiên |
| `version` | `integer` | Không | `1` | CHECK | Phiên bản cập nhật |
| `created_at` | `timestamptz` | Không | `now()` | | Thời điểm tạo |
| `updated_at` | `timestamptz` | Không | `now()` | | Thời điểm cập nhật |

### Constraint

- `PRIMARY KEY (id)`
- `UNIQUE (id, project_id)`
- `FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT`
- `FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT`
- `CHECK (title = btrim(title))`
- `CHECK (char_length(title) BETWEEN 1 AND 200)`
- `CHECK (description IS NULL OR char_length(description) BETWEEN 1 AND 10000)`
- `CHECK (status IN ('todo', 'in_progress', 'done'))`
- `CHECK (priority IN ('low', 'medium', 'high'))`
- `CHECK (version >= 1)`

## 8. Bảng `task_assignees`

Lưu những thành viên đang được giao thực hiện task.

| Cột | Kiểu PostgreSQL | NULL | Default | Ràng buộc | Ý nghĩa |
|---|---|:---:|---|---|---|
| `task_id` | `uuid` | Không | Không | PK, FK ghép | Task được giao |
| `project_id` | `uuid` | Không | Không | FK ghép | Project của task |
| `user_id` | `uuid` | Không | Không | PK, FK ghép | Người được giao |
| `assigned_by` | `uuid` | Không | Không | FK | Người thực hiện giao |
| `assigned_at` | `timestamptz` | Không | `now()` | | Thời điểm giao |

### Constraint

- `PRIMARY KEY (task_id, user_id)`
- `FOREIGN KEY (task_id, project_id) REFERENCES tasks(id, project_id) ON DELETE RESTRICT`
- `FOREIGN KEY (project_id, user_id) REFERENCES project_members(project_id, user_id) ON DELETE RESTRICT`
- `FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE RESTRICT`

## 9. Bảng `activity_logs`

Lưu lịch sử những hành động quan trọng trong project.

| Cột | Kiểu PostgreSQL | NULL | Default | Ràng buộc | Ý nghĩa |
|---|---|:---:|---|---|---|
| `id` | `uuid` | Không | `gen_random_uuid()` | Primary key | Định danh log |
| `project_id` | `uuid` | Không | Không | FK | Project phát sinh sự kiện |
| `actor_id` | `uuid` | Không | Không | FK | User thực hiện hành động |
| `task_id` | `uuid` | Có | Không | FK ghép | Task liên quan |
| `target_user_id` | `uuid` | Có | Không | FK | User chịu tác động |
| `action` | `text` | Không | Không | CHECK | Loại hành động |
| `metadata` | `jsonb` | Không | `'{}'::jsonb` | Phải là JSON object | Dữ liệu bổ sung |
| `created_at` | `timestamptz` | Không | `now()` | | Thời điểm xảy ra |

### Giá trị action

- `project_created`
- `member_added`
- `member_removed`
- `member_role_changed`
- `task_created`
- `task_status_changed`
- `task_assigned`
- `task_unassigned`

### Constraint

- `PRIMARY KEY (id)`
- `FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT`
- `FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE RESTRICT`
- `FOREIGN KEY (task_id, project_id) REFERENCES tasks(id, project_id) ON DELETE RESTRICT`
- `FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE RESTRICT`
- `CHECK (action IN ('project_created', 'member_added', 'member_removed', 'member_role_changed', 'task_created', 'task_status_changed', 'task_assigned', 'task_unassigned'))`
- `CHECK (jsonb_typeof(metadata) = 'object')`

## 10. Quy tắc tham chiếu của activity log

| Nhóm action | `task_id` | `target_user_id` |
|---|:---:|:---:|
| `project_created` | `NULL` | `NULL` |
| `member_added`, `member_removed`, `member_role_changed` | `NULL` | Bắt buộc |
| `task_created`, `task_status_changed` | Bắt buộc | `NULL` |
| `task_assigned`, `task_unassigned` | Bắt buộc | Bắt buộc |

Các quy tắc trên có thể được bảo vệ bằng table-level CHECK constraint vì chúng chỉ kiểm tra dữ liệu trong cùng một dòng.

Khóa ngoại ghép `(task_id, project_id)` bảo đảm task được tham chiếu thuộc đúng project của activity log.

Activity log là bất biến trong MVP:

- Không có API cập nhật activity log.
- Không có API xóa activity log.
- Không có cột `updated_at`.
- Log phải được tạo trong cùng transaction với hành động nghiệp vụ.

## 11. Trạng thái triển khai Drizzle

Data Dictionary đã được ánh xạ tại:

- `server/database/schema.ts`
- `drizzle.config.ts`

Đã triển khai:

- Sáu bảng của MVP.
- UUID và `gen_random_uuid()`.
- `timestamptz` và `now()`.
- Nullability và default.
- Primary key đơn và khóa ghép.
- Foreign key đơn và khóa ghép.
- `ON DELETE RESTRICT`.
- Unique constraint `(tasks.id, tasks.project_id)`.
- Check constraint cho chuỗi và giá trị hữu hạn.
- Check constraint cho cấu trúc activity log.
- TypeScript type cho select và insert.

Đã kiểm tra bằng:

```bash
pnpm db:export
