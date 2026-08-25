# TaskFlow — Đặc tả MVP

## 1. Trạng thái tài liệu

- Trạng thái: Draft
- Phiên bản: 0.1
- Ngày tạo: 2026-08-25
- Phạm vi: MVP
- Người chịu trách nhiệm: Trương Văn Toàn

## 2. Mục tiêu sản phẩm

TaskFlow là dashboard quản lý dự án và công việc nội bộ.

Hệ thống giúp một nhóm:

- Tạo và quản lý project.
- Quản lý thành viên trong project.
- Tạo và cập nhật task.
- Gán task cho thành viên.
- Theo dõi các thay đổi quan trọng.

Mục tiêu của MVP là chứng minh đầy đủ luồng quản lý project và task với phân quyền, tính nhất quán dữ liệu và khả năng xử lý cập nhật đồng thời.

## 3. Đối tượng sử dụng

### 3.1 Khách chưa đăng nhập

Khách chưa đăng nhập không được truy cập dữ liệu project hoặc task.

### 3.2 Người dùng đã đăng nhập

Người dùng đã đăng nhập có thể:

- Tạo project.
- Tham gia nhiều project.
- Có vai trò khác nhau trong từng project.

## 4. Phạm vi MVP

MVP bao gồm:

- Xác định người dùng hiện tại từ session đã xác thực.
- Tạo project.
- Cập nhật thông tin project.
- Thêm và quản lý thành viên.
- Phân quyền theo project.
- Tạo task.
- Cập nhật task.
- Gán một hoặc nhiều thành viên vào task.
- Lọc và phân trang danh sách task.
- Ghi activity log cho hành động quan trọng.
- Phát hiện xung đột khi hai người cùng cập nhật task.

Việc triển khai chức năng đăng nhập sẽ được thực hiện ở giai đoạn sau. Trong đặc tả này, hệ thống giả định API có thể nhận được actor đã được xác thực từ session phía server.

## 5. Ngoài phạm vi MVP

Các chức năng sau chưa thực hiện trong MVP:

- Tag.
- Subtask.
- Recurring task.
- Comment.
- File đính kèm.
- Notification.
- Chat.
- Cập nhật thời gian thực.
- Kanban kéo thả.
- Báo cáo nâng cao.
- Xóa và khôi phục project.
- Xóa và khôi phục task.
- AI trong ứng dụng.

Những chức năng này không được tự động thêm vào schema hoặc API khi chưa có đặc tả mới.

## 6. Khái niệm nghiệp vụ

### User

Người sử dụng TaskFlow.

### Project

Không gian chứa thành viên và task.

### Project member

Mối quan hệ giữa user và project, bao gồm vai trò của user trong project đó.

### Task

Công việc thuộc đúng một project.

### Task assignee

Một thành viên được giao thực hiện task.

### Activity log

Bản ghi mô tả hành động quan trọng đã xảy ra trong hệ thống.

## 7. Vai trò và quyền

### 7.1 Owner

Owner được phép:

- Xem project.
- Cập nhật thông tin project.
- Thêm thành viên.
- Xóa thành viên khi thỏa mãn business rule.
- Thay đổi vai trò thành viên.
- Tạo task.
- Cập nhật task.
- Gán task cho thành viên.
- Xem activity log.

### 7.2 Member

Member được phép:

- Xem project.
- Xem danh sách thành viên.
- Tạo task.
- Cập nhật task trong project.
- Gán task cho thành viên trong cùng project.
- Xem activity log.

Member không được:

- Cập nhật thông tin project.
- Thêm hoặc xóa thành viên.
- Thay đổi vai trò thành viên.

### 7.3 Viewer

Viewer được phép:

- Xem project.
- Xem danh sách thành viên.
- Xem task.
- Xem activity log.

Viewer không được:

- Thay đổi project.
- Quản lý thành viên.
- Tạo hoặc cập nhật task.
- Gán người thực hiện task.

## 8. Ma trận phân quyền

| Hành động              | Owner | Member | Viewer |
| Xem project            | Có    | Có     | Có     |
| Cập nhật project       | Có    | Không  | Không  |
| Xem thành viên         | Có    | Có     | Có     |
| Thêm thành viên        | Có    | Không  | Không  |
| Xóa thành viên         | Có    | Không  | Không  |
| Thay đổi vai trò       | Có    | Không  | Không  |
| Xem task               | Có    | Có     | Có     |
| Tạo task               | Có    | Có     | Không  |
| Cập nhật task          | Có    | Có     | Không  |
| Gán task               | Có    | Có     | Không  |
| Xem activity log       | Có    | Có     | Có     |

## 9. Business rules

### BR-01 — Yêu cầu xác thực

Người dùng phải được xác thực trước khi truy cập dữ liệu project.

Actor ID phải được lấy từ session đã được server xác minh, không được lấy từ request body.

### BR-02 — Người tạo project là owner

Khi người dùng tạo project thành công, người đó phải trở thành owner của project.

Project và membership của owner phải được tạo như một thao tác toàn vẹn: hoặc tất cả thành công hoặc không có dữ liệu nào được tạo.

### BR-03 — Project phải có owner

Mỗi project phải luôn có ít nhất một owner.

Không được xóa hoặc hạ quyền owner cuối cùng của project.

### BR-04 — Quản lý thành viên

Chỉ owner của project được:

- Thêm thành viên.
- Xóa thành viên.
- Thay đổi vai trò của thành viên.

Owner chỉ có thể quản lý thành viên trong project mà họ sở hữu.

### BR-05 — Quyền của member

Member được tạo và cập nhật mọi task thuộc project mà họ là thành viên.

Member không được cập nhật project hoặc quản lý membership.

### BR-06 — Viewer chỉ được đọc

Viewer chỉ được đọc dữ liệu.

Nếu viewer cố tạo hoặc cập nhật dữ liệu, hệ thống phải từ chối và không được tạo ra thay đổi một phần.

### BR-07 — Task thuộc một project

Mỗi task phải thuộc đúng một project.

Không được di chuyển task sang project khác trong MVP.

### BR-08 — Quy tắc assignee

Một task có thể có nhiều assignee.

Mỗi assignee phải là thành viên hiện tại của cùng project chứa task.

Không được gán một user ngoài project vào task.

Không được gán trùng cùng một user vào cùng một task.

### BR-09 — Xóa thành viên đang được giao việc

Không được xóa thành viên khỏi project nếu người đó đang được gán vào task chưa hoàn thành.

Owner phải bỏ gán hoặc hoàn thành các task liên quan trước.

### BR-10 — Giá trị của task

Title của task:

- Bắt buộc.
- Sau khi trim phải có ít nhất một ký tự.
- Không dài quá 200 ký tự.

Description:

- Không bắt buộc.
- Không dài quá 10.000 ký tự.

Status chỉ nhận:

- `todo`
- `in_progress`
- `done`

Priority chỉ nhận:

- `low`
- `medium`
- `high`

### BR-11 — Cập nhật đồng thời

Mỗi task có một version.

Khi cập nhật task, client phải gửi version mà nó đang chỉnh sửa.

Nếu version trong database đã thay đổi, hệ thống phải từ chối request thay vì ghi đè dữ liệu mới hơn.

### BR-12 — Activity log

Hệ thống phải ghi activity log cho các hành động:

- Tạo project.
- Thêm hoặc xóa thành viên.
- Thay đổi vai trò.
- Tạo task.
- Thay đổi trạng thái task.
- Thay đổi assignee.

Activity log không được sửa hoặc xóa trong MVP.

### BR-13 — Xóa dữ liệu

MVP chưa hỗ trợ xóa project hoặc task.

Không tự triển khai hard delete hoặc soft delete khi chưa có đặc tả bổ sung.

## 10. Quy ước lỗi

| Tình huống | Kết quả mong đợi |
|---|---|
| Chưa đăng nhập | `401 Unauthorized` |
| Đã đăng nhập nhưng không có quyền | `403 Forbidden` |
| Không tìm thấy tài nguyên | `404 Not Found` |
| Trạng thái hiện tại xung đột với yêu cầu | `409 Conflict` |
| Dữ liệu đầu vào không hợp lệ | `422 Unprocessable Entity` |

Tên error code chi tiết sẽ được chốt khi thiết kế API contract.

## 11. Acceptance criteria

### AC-01 — Khách truy cập project

Given người dùng chưa đăng nhập  
When người dùng yêu cầu xem một project  
Then hệ thống trả về `401 Unauthorized`  
And không trả về dữ liệu project

### AC-02 — Tạo project

Given người dùng đã đăng nhập  
When người dùng tạo project với dữ liệu hợp lệ  
Then project được tạo  
And người tạo trở thành owner  
And activity log tạo project được ghi  
And các thao tác được thực hiện toàn vẹn

### AC-03 — Viewer tạo task

Given người dùng là viewer của project  
When người dùng gửi yêu cầu tạo task  
Then hệ thống trả về `403 Forbidden`  
And không có task nào được tạo  
And không có activity log sai được tạo

### AC-04 — Member tạo task

Given người dùng là member của project  
When người dùng tạo task với dữ liệu hợp lệ  
Then task được tạo  
And task thuộc đúng project  
And activity log được ghi

### AC-05 — Gán user ngoài project

Given user X không phải thành viên của project A  
When owner hoặc member gán task của project A cho X  
Then hệ thống trả về `409 Conflict`  
And không tạo task assignee

### AC-06 — Gán trùng assignee

Given user X đã được gán vào task T  
When hệ thống nhận yêu cầu gán X vào T lần nữa  
Then hệ thống từ chối yêu cầu  
And chỉ tồn tại một assignment của X với T

### AC-07 — Xóa owner cuối cùng

Given project chỉ còn một owner  
When owner đó bị xóa hoặc bị đổi sang role khác  
Then hệ thống trả về `409 Conflict`  
And project vẫn giữ owner hiện tại

### AC-08 — Xóa thành viên đang có task

Given member M đang được gán vào một task chưa hoàn thành  
When owner yêu cầu xóa M khỏi project  
Then hệ thống trả về `409 Conflict`  
And membership và assignment không thay đổi

### AC-09 — Status không hợp lệ

Given người dùng có quyền cập nhật task  
When người dùng gửi status không nằm trong danh sách cho phép  
Then hệ thống trả về `422 Unprocessable Entity`  
And task không thay đổi

### AC-10 — Cập nhật đồng thời

Given hai người cùng đọc task ở version 1  
When người thứ nhất cập nhật thành công  
And người thứ hai gửi cập nhật với version 1  
Then request thứ hai trả về `409 Conflict`  
And dữ liệu của người thứ nhất không bị ghi đè

## 12. Các quyết định đã chốt

- TaskFlow là ứng dụng quản lý project và task nội bộ.
- Quyền được xác định theo từng project.
- Một project có thể có nhiều owner.
- Một project phải luôn có ít nhất một owner.
- Member được cập nhật mọi task trong project.
- Một task có thể có nhiều assignee.
- Assignee phải là thành viên của cùng project.
- MVP không hỗ trợ xóa project hoặc task.
- Cập nhật task sử dụng optimistic concurrency.
- Authentication provider chưa được chọn trong Buổi 2.

## 13. Câu hỏi dành cho giai đoạn sau

Các nội dung sau chưa được thiết kế trong Buổi 2:

- Danh sách bảng và cột.
- Kiểu khóa chính.
- Kiểu dữ liệu.
- Foreign key và quy tắc `ON DELETE`.
- Index.
- API endpoint và response body chi tiết.
- Authentication provider.
- Cách triển khai production.

## 14. Tiêu chí hoàn thành đặc tả

Đặc tả đạt khi:

- Mỗi vai trò có quyền rõ ràng.
- Mỗi hành động ghi dữ liệu có người được phép thực hiện.
- Business rule có mã định danh.
- Các rule quan trọng có acceptance criteria.
- Không có rule mâu thuẫn với ma trận phân quyền.
- Phạm vi chưa làm được ghi rõ.
- Có thể dùng tài liệu để thiết kế ERD ở Buổi 3.