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

## Success response

- HTTP status: `201 Created`
- Response body: `{ "data": Task }`

## Chưa triển khai

- Session authentication thật.
- Transaction tạo task và activity log.
- API integration test.