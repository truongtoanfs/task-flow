# TaskFlow — API Conventions

## 1. Trạng thái

- Trạng thái: Ready for API Implementation
- Phạm vi: TaskFlow MVP
- Validation: Zod
- Error handling: Standardized API error

## 2. Nguyên tắc

- Mọi params, query và body phải được validate phía server.
- Dữ liệu từ client luôn được xem là `unknown` trước validation.
- Object schema sử dụng `z.strictObject()`.
- Field lạ bị từ chối.
- Actor ID phải lấy từ session, không lấy từ request body.
- Project ID và task ID lấy từ route params.
- Validation không chịu trách nhiệm kiểm tra quyền.
- Validation không truy vấn database.
- Không trả stack trace, SQL hoặc thông tin nội bộ cho client.

## 3. Success response

```json
{
  "data": {}
}
```

Mọi response thành công có trường `data`.

## 4. Error response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": [
      {
        "path": "title",
        "code": "too_small",
        "message": "Title is required."
      }
    ]
  }
}
```

`details` là tùy chọn và chỉ chứa dữ liệu an toàn.

## 5. HTTP status

| Status | Trường hợp |
|---:|---|
| `400` | Request hoặc JSON không đọc được |
| `401` | Chưa xác thực |
| `403` | Không có quyền |
| `404` | Không tìm thấy hoặc không được thấy tài nguyên |
| `409` | Xung đột trạng thái nghiệp vụ |
| `422` | Input không đạt validation |
| `500` | Lỗi server ngoài dự kiến |

## 6. Error code

| Code | HTTP | Ý nghĩa |
|---|---:|---|
| `BAD_REQUEST` | 400 | Request không đọc được |
| `VALIDATION_ERROR` | 422 | Input không hợp lệ |
| `AUTHENTICATION_REQUIRED` | 401 | Chưa đăng nhập |
| `FORBIDDEN` | 403 | Thiếu quyền |
| `RESOURCE_NOT_FOUND` | 404 | Không tìm thấy tài nguyên |
| `MEMBERSHIP_ALREADY_EXISTS` | 409 | Membership đã tồn tại |
| `ASSIGNEE_NOT_PROJECT_MEMBER` | 409 | Assignee không thuộc project |
| `ASSIGNMENT_ALREADY_EXISTS` | 409 | Assignment đã tồn tại |
| `LAST_OWNER_REQUIRED` | 409 | Không được xóa/hạ quyền owner cuối |
| `MEMBER_HAS_ASSIGNMENTS` | 409 | Member vẫn còn assignment |
| `VERSION_CONFLICT` | 409 | Task đã được cập nhật bởi request khác |
| `INTERNAL_ERROR` | 500 | Lỗi ngoài dự kiến |

## 7. Phân chia trách nhiệm

### Validation

Kiểm tra:

- Kiểu dữ liệu.
- Field bắt buộc.
- UUID.
- Độ dài.
- Enum.
- Field lạ.
- Pagination.

### Authentication

Kiểm tra người dùng đã đăng nhập hay chưa.

### Authorization

Kiểm tra role của actor trong project.

### Business rule

Kiểm tra:

- Assignee thuộc project.
- Membership đã tồn tại.
- Owner cuối cùng.
- Member còn assignment.
- Optimistic concurrency.

## 8. Contract dự kiến của API tạo task

Endpoint sẽ được triển khai ở Buổi 10:

```text
POST /api/projects/:projectId/tasks
```

Route params:

```json
{
  "projectId": "uuid"
}
```

Body:

```json
{
  "title": "Prepare API contract",
  "description": "Optional description",
  "status": "todo",
  "priority": "medium"
}
```

Client không được gửi:

- `id`
- `projectId`
- `createdBy`
- `actorId`
- `version`
- `createdAt`
- `updatedAt`

Actor sẽ được lấy từ session server.

Response thành công dự kiến:

```json
{
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "createdBy": "uuid",
    "title": "Prepare API contract",
    "description": "Optional description",
    "status": "todo",
    "priority": "medium",
    "version": 1,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

HTTP status thành công: `201 Created`.

## 9. Phạm vi chưa triển khai

- API endpoint.
- Session authentication.
- Authorization.
- Repository.
- Service.
- Database client cho Nuxt.
- Transaction tạo task và activity log.