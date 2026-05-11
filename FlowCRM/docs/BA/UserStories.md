# FlowCRM - User Stories & Acceptance Criteria

---

## 1. User Personas

### 1.1 Sales Representative - Minh

**Background:**
- 28 tuổi, 3 năm kinh nghiệm sales
- Làm việc tại công ty SME vừa
- Thường xuyên di chuyển, làm việc từ xa

**Goals:**
- Cập nhật trạng thái deal nhanh chóng
- Không bỏ lỡ follow-up deadline
- Tìm kiếm thông tin khách hàng dễ dàng

**Pain Points:**
- Excel phức tạp, nhiều sheet
- Quên deadline vì không có reminders
- Khó theo dõi nhiều deal cùng lúc

### 1.2 Sales Manager - Lan

**Background:**
- 35 tuổi, 7 năm kinh nghiệm, quản lý team 5 người
- Chịu trách nhiệm về forecast doanh thu
- Phải báo cáo cho CEO hàng tuần

**Goals:**
- Nhìn tổng quan pipeline của team
- Dự báo doanh thu chính xác
- Đánh giá hiệu suất nhân viên

**Pain Points:**
- Report thủ công tốn thời gian
- Thiếu visibility về deal đang ở đâu
- Khó phân bổ nguồn lực hợp lý

---

## 2. User Stories

### Epic: Pipeline Management

---

#### US-001: Xem Dashboard tổng quan

**Actor:** Sales Rep, Sales Manager
**Priority:** Must Have

**Description:**
Là người dùng, tôi muốn xem dashboard với các KPI quan trọng để nắm bắt tình hình kinh doanh trong 5 giây.

**Acceptance Criteria:**
- [ ] Hiển thị 4 KPI cards: Open Deals, Expected Revenue, Conversion Rate, New Customers
- [ ] Mỗi KPI show giá trị, trend (tăng/giảm), và context
- [ ] Pipeline chart dạng bar chart với 5 stages
- [ ] Task list hôm nay với checkbox completion
- [ ] Activity feed hiển thị hoạt động gần đây

**Technical Notes:**
- Data loaded from localStorage
- Charts rendered with CSS (no library)

---

#### US-002: Kéo thả Deal qua các cột Pipeline

**Actor:** Sales Rep
**Priority:** Must Have

**Description:**
Là Sales Rep, tôi muốn kéo thả deal qua các cột "Chào hàng", "Đàm phán", "Đề xuất", "Chốt" để cập nhật tiến độ nhanh chóng.

**Acceptance Criteria:**
- [ ] 5 cột pipeline hiển thị: Qualification, Proposal, Negotiation, Closed Won, Closed Lost
- [ ] Drag-drop card giữa các cột hoạt động mượt
- [ ] Số lượng deal trong cột tự động cập nhật
- [ ] Visual feedback khi kéo (card opacity, target highlight)
- [ ] Card hiển thị: tên deal, khách hàng, giá trị, tag ưu tiên

**Technical Notes:**
- Use HTML5 Drag and Drop API
- Update counts on drop
- Log stage changes

---

#### US-003: Tạo Deal nhanh từ Dashboard

**Actor:** Sales Rep
**Priority:** Must Have

**Description:**
Là Sales Rep, tôi muốn tạo deal mới ngay từ Dashboard mà không cần rời trang để tiết kiệm thời gian.

**Acceptance Criteria:**
- [ ] "Tạo Deal" button trên topbar
- [ ] Modal popup với form: Tên deal, Giá trị, Giai đoạn, Khách hàng, Ưu tiên, Mô tả
- [ ] Required fields được validate real-time
- [ ] Submit thành công hiển thị confirmation
- [ ] Modal đóng sau khi tạo thành công

**Technical Notes:**
- Ctrl+N shortcut to open
- Auto-focus first field
- Form validation on blur and submit

---

#### US-004: Xem tổng giá trị deals theo giai đoạn

**Actor:** Sales Manager
**Priority:** Must Have

**Description:**
Là Sales Manager, tôi muốn xem tổng giá trị deals theo từng giai đoạn để dự báo doanh thu chính xác.

**Acceptance Criteria:**
- [ ] Pipeline chart hiển thị bar với chiều cao tỷ lệ với giá trị
- [ ] Mỗi bar hiển thị giá trị VNĐ format
- [ ] Toggle được giữa Tuần/Tháng/Quý
- [ ] Tổng pipeline value được tính toán

**Technical Notes:**
- Sum values per stage
- Format with Intl.NumberFormat

---

#### US-005: Tìm kiếm nhanh khách hàng và deal

**Actor:** Sales Rep, Sales Manager
**Priority:** Must Have

**Description:**
Là người dùng, tôi muốn tìm kiếm nhanh khách hàng và deal để tra cứu khi cần.

**Acceptance Criteria:**
- [ ] Search box trên topbar với icon magnifying glass
- [ ] Search cho customers page với filter theo tên, email, công ty
- [ ] Results update real-time as typing (debounced)
- [ ] No results state displayed when no matches

**Technical Notes:**
- Debounce 300ms
- Case-insensitive search
- Highlight matching text

---

#### US-006: Xem và quản lý danh sách khách hàng

**Actor:** Sales Rep, Sales Manager
**Priority:** Must Have

**Description:**
Là người dùng, tôi muốn xem danh sách khách hàng với thông tin chi tiết và thao tác nhanh.

**Acceptance Criteria:**
- [ ] Table với 8 columns: checkbox, name, company, email, phone, status, latest deal, actions
- [ ] Avatar với initials cho mỗi customer
- [ ] Status badges: Active (green), Prospect (blue), Inactive (gray)
- [ ] Row hover state
- [ ] Pagination với 8 rows/page

**Technical Notes:**
- Sortable columns (future)
- Row selection with checkboxes

---

#### US-007: Thêm khách hàng mới

**Actor:** Sales Rep
**Priority:** Should Have

**Description:**
Là Sales Rep, tôi muốn thêm khách hàng mới vào hệ thống để theo dõi.

**Acceptance Criteria:**
- [ ] "Thêm khách hàng" button mở modal
- [ ] Form fields: First Name, Last Name, Email, Phone, Company, Status, Notes
- [ ] Email validation
- [ ] Success confirmation on save
- [ ] Customer appears in list after creation

---

#### US-008: Inline edit thông tin khách hàng

**Actor:** Sales Rep
**Priority:** Should Have

**Description:**
Là Sales Rep, tôi muốn chỉnh sửa nhanh thông tin khách hàng mà không cần mở modal riêng.

**Acceptance Criteria:**
- [ ] Double-click on cell to edit
- [ ] Save on Enter, cancel on Escape
- [ ] Visual indication of editable cells
- [ ] Validation before save

---

#### US-009: Hoàn thành công việc hàng ngày

**Actor:** Sales Rep
**Priority:** Should Have

**Description:**
Là Sales Rep, tôi muốn đánh dấu hoàn thành công việc để theo dõi tiến độ.

**Acceptance Criteria:**
- [ ] Checkbox next to each task
- [ ] Click checkbox to toggle complete
- [ ] Completed tasks show strikethrough
- [ ] Show completion time

---

#### US-010: Xem chi tiết Deal

**Actor:** Sales Rep, Sales Manager
**Priority:** Could Have

**Description:**
Là người dùng, tôi muốn xem chi tiết một deal để có context đầy đủ.

**Acceptance Criteria:**
- [ ] Click on deal card opens detail view
- [ ] Shows all deal information
- [ ] Activity history for that deal
- [ ] Edit capability

---

## 3. Non-Functional Requirements

### 3.1 Performance

- Page load < 2s on 3G
- Drag operations at 60fps
- No jank during animations

### 3.2 Accessibility

- Full keyboard navigation
- ARIA labels on interactive elements
- Focus visible states

### 3.3 Responsiveness

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

---

## 4. Sprint Planning

### Sprint 1: Core UI (1 week)
- US-001: Dashboard
- US-003: Quick Create Modal
- US-005: Search

### Sprint 2: Pipeline (1 week)
- US-002: Kanban Board
- US-004: Pipeline Chart

### Sprint 3: Customers (1 week)
- US-006: Customer List
- US-007: Add Customer
- US-008: Inline Edit

### Sprint 4: Polish (1 week)
- US-009: Todo interactions
- US-010: Deal details
- Bug fixes, testing