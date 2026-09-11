# TaskFlow — Create Task API

## Endpoint

`POST /api/projects/:projectId/tasks`

## Authentication

Actor được lấy từ server context.

Trong development, actor được cấu hình bằng
`NUXT_TASKFLOW_DEV_ACTOR_ID`.

Cơ chế development actor bị vô hiệu hóa khi
`NODE_ENV=production`.

## Authorization

| Role | Kết quả |
|---|---|
| owner | Được tạo task |
| member | Được tạo task |
| viewer | 403 FORBIDDEN |
| outsider | 404 RESOURCE_NOT_FOUND |

## Validation

- `projectId` phải là UUID.
- `title` dài từ 1 đến 200 ký tự sau trim.
- `description` tối đa 10.000 ký tự.
- `status`: `todo`, `in_progress`, `done`.
- `priority`: `low`, `medium`, `high`.
- Field lạ bị từ chối.

## Transaction

Tạo task được thực hiện trong một database transaction:

1. Đọc và khóa membership của actor.
2. Kiểm tra quyền tạo task.
3. Insert task.
4. Insert activity log `task_created`.
5. Commit khi mọi thao tác thành công.
6. Rollback nếu bất kỳ thao tác nào thất bại.

Task và activity log không được tồn tại riêng lẻ.

Activity log tạo task có cấu trúc:

- `project_id`: project của task.
- `actor_id`: người tạo task.
- `task_id`: task vừa tạo.
- `target_user_id`: `NULL`.
- `action`: `task_created`.
- `metadata`: `{}`.

## Success response

- HTTP status: `201 Created`
- Response body: `{ "data": Task }`

## Chưa triển khai

- Session authentication thật.
- API integration test tự động.