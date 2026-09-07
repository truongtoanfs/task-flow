# TaskFlow — Seed Data

## 1. Trạng thái

- Trạng thái: Implemented and Verified
- Phạm vi: Local development and test
- File thực thi: `server/database/seed.ts`
- Lệnh chạy: `pnpm db:seed`

## 2. Mục tiêu

Seed cung cấp bộ dữ liệu ổn định để phát triển và kiểm tra:

- Phân quyền.
- Task filter.
- Quan hệ project membership.
- Task assignee.
- Activity log.
- Các trường hợp dữ liệu biên.

Seed không được sử dụng để tạo dữ liệu production.

## 3. Dữ liệu

| Bảng | Số dòng |
|---|---:|
| `users` | 4 |
| `projects` | 1 |
| `project_members` | 3 |
| `tasks` | 3 |
| `task_assignees` | 3 |
| `activity_logs` | 9 |

## 4. User

- `TaskFlow Owner`: role `owner`.
- `TaskFlow Member`: role `member`.
- `TaskFlow Viewer`: role `viewer`.
- `TaskFlow Outsider`: không thuộc project.

## 5. Task scenarios

- Có đủ `todo`, `in_progress`, `done`.
- Có đủ `low`, `medium`, `high`.
- Có task không có assignee.
- Có task có một assignee.
- Có task có hai assignee.
- Có task với `description = NULL`.
- Có task với title đúng 200 ký tự.

## 6. Tính chạy lặp an toàn

Seed sử dụng:

- UUID cố định.
- `onConflictDoNothing()`.
- Một database transaction.
- Thứ tự insert theo quan hệ foreign key.

Chạy `pnpm db:seed` nhiều lần không làm tăng số bản ghi seed.

## 7. Quy tắc an toàn

- Không chạy seed trong production.
- Không xóa dữ liệu hiện có.
- Không reset Docker volume để chạy seed.
- Không chứa password hoặc secret.
- Không đưa dữ liệu cố ý vi phạm constraint vào seed.
