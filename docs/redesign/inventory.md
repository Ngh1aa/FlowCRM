# FlowCRM trước redesign

Mốc nguồn `e768052`. Người dùng giả định là nhân viên bán hàng đang cập nhật cơ hội, tìm khách hàng và chốt lịch hoặc việc tiếp theo trong một phiên làm việc ngắn. Tiêu chí chính là vào thẳng Demo, tìm đúng cơ hội, đổi giai đoạn và theo dõi lịch hoặc nhiệm vụ mà vẫn giữ ngữ cảnh.

## Chủ sở hữu giao diện

| Chủ sở hữu | Vai trò và quan hệ |
|---|---|
| `FlowCRM/assets/css/design-system.css` | Token màu, chữ, spacing, radius, lớp nền. Nạp trước CSS giao diện. |
| `styles.css` | Nạp `styles-base.css`, sau đó `motion.css`. |
| `styles-base.css` | Shell, component, từng màn và nhiều đợt override. Tasks có markup cũ đang bị ẩn và nhiều tầng CSS áp vào cùng selector. |
| `motion.css` | Chuyển động và reduced motion của Pipeline. |
| `auth.css` | Layout Đăng nhập và Đăng ký. |
| `app.js` | localStorage và dữ liệu mẫu. Render cơ hội, khách hàng, nhiệm vụ, tổng quan và xử lý tương tác. Khách hàng và Tin nhắn nạp file hai lần. |
| `auth.js` | Phiên Demo tự mở, thông tin vai trò và luồng tài khoản local. |
| `deal-follow-up.js` | Hộp kế hoạch, đường về đúng cơ hội và hàng nhiệm vụ liên kết. |
| `FlowCRM/*.html` | Tám màn làm việc và hai màn tài khoản. Sidebar lặp giữa các trang. Lịch, Tin nhắn và Cài đặt có logic nội tuyến riêng. |

Không phát hiện bước sinh HTML/CSS trong cấu hình ứng dụng. CSS dùng màu cố định và selector lặp ở các lớp làm mới. Khi thay layout sẽ sửa phần đang sở hữu và dọn phần cũ bị thay.

## Nhận diện cần giữ

- Nền charcoal, chữ sáng ấm và một màu nhấn có vai trò rõ.
- Chữ sans hỗ trợ tiếng Việt, giá tiền và ngày đọc được khi quét nhanh.
- Nhãn giai đoạn và trạng thái đi kèm màu.
- Điều hướng trái trên desktop, lối vào gọn trên mobile.
- Pipeline là trung tâm cập nhật cơ hội. Một cơ hội nối một lịch hẹn và một nhiệm vụ.
- Chuyển động nhẹ có hỗ trợ reduced motion.

Hero cao, chữ quảng bá trong màn làm việc, bo tròn chồng lớp, hành động không có tên và số mẫu tách khỏi dữ liệu thao tác là các vấn đề thực thi. Giả định giữ giao diện tối theo bản hiện tại.

## Ảnh và kiểm tra trước khi sửa

- 20 ảnh gốc của 10 trang ở 1440 và 390px, kèm danh sách lỗi trình duyệt và phép đo độ rộng, nằm trong thư mục công việc `before-redesign`.
- Khách hàng và Tin nhắn có lỗi `Identifier 'Storage' has already been declared` ở cả hai cỡ. Tổng quan, Pipeline, Khách hàng, Lịch hẹn, Nhiệm vụ và Tin nhắn có nút biểu tượng hiện ra mà thiếu tên trong markup.
- Bộ kiểm tra hành vi hiện có `qa/flowcrm-follow-up.cjs` bảo vệ luồng Pipeline → Lịch hẹn → Nhiệm vụ, lưu và tải lại, deep link, kéo thả, thao tác chạm và phím. Test này có selector của DOM hiện hành. Khi đổi cấu trúc sẽ thay selector bằng vai trò hoặc tên khi phù hợp, giữ nguyên tiêu chí hành vi.

## Bản đồ thay thế sau duyệt hướng

| Khu vực | Thay tại nguồn | Tiêu chí cần giữ hoặc kiểm tra |
|---|---|---|
| Shell | Sidebar, topbar, nội dung, focus và mobile nav dùng chung | Mở đúng trang, trạng thái đang chọn, focus khi mở/đóng menu, không che nội dung. |
| Tổng quan và Báo cáo | Xếp theo việc cần xử lý, tiếp đến số liệu và bảng | Số, kỳ, đơn vị và dữ liệu thay đổi nhất quán. |
| Pipeline | Bỏ hero quảng bá, đưa công cụ và cơ hội lên đầu | Tạo, tìm, chuyển giai đoạn bằng phím/chạm và kéo thả, lưu kế hoạch, mở lại đúng cơ hội. |
| Khách hàng và Tin nhắn | Chuẩn hóa danh sách, vùng chi tiết, cách quay lại trên mobile, bỏ nạp script trùng | Tìm đúng người, xem đúng cuộc trò chuyện, trạng thái rỗng và nội dung dài. |
| Lịch hẹn và Nhiệm vụ | Lịch ngày/tháng, danh sách việc và bộ lọc rõ tầng | Đúng ngày giờ, xem ngày ở mobile, sửa, hoàn thành và giữ trạng thái sau tải lại. |
| Cài đặt và tài khoản | Nhóm theo hồ sơ, mật khẩu và quản lý người dùng | Nhãn form, lỗi cạnh trường, xác nhận thao tác quan trọng, giữ đúng vai trò và đường vào Demo. |
