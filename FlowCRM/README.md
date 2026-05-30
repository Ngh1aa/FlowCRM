# FlowCRM – Hệ thống quản lý bán hàng và khách hàng

## Mô tả

FlowCRM là hệ thống CRM dashboard và quản lý bán hàng, được thiết kế để hỗ trợ đội ngũ kinh doanh quản lý leads, khách hàng, deals, tasks, appointments, messages và reports. Project tập trung chuyển đổi quy trình bán hàng rời rạc thành hệ thống yêu cầu rõ ràng, user flow có cấu trúc và giao diện quản lý dễ sử dụng.

### Mục tiêu chính

- Cung cấp dashboard KPI trực quan, giúp đội ngũ kinh doanh theo dõi hiệu suất theo thời gian thực
- Quản lý leads và khách hàng tập trung, dễ dàng cập nhật và tra cứu
- Trực quan hóa sales pipeline qua Kanban board
- Sắp xếp task theo mức độ ưu tiên để đảm bảo công việc quan trọng được xử lý trước
- Quản lý lịch hẹn và tin nhắn giúp nâng cao hiệu quả giao tiếp với khách hàng
- Tổng hợp báo cáo để đưa ra quyết định kinh doanh dựa trên dữ liệu

### Các module chính

| Module | Mô tả |
|--------|--------|
| **KPI Dashboard** | Theo dõi các chỉ số hiệu suất kinh doanh chủ chốt |
| **Kanban Pipeline** | Trực quan hóa deals theo từng giai đoạn bán hàng |
| **Customers** | Quản lý thông tin và lịch sử khách hàng |
| **Tasks** | Quản lý công việc theo mức độ ưu tiên |
| **Calendar** | Lịch hẹn với khách hàng và nội bộ |
| **Messages** | Giao tiếp với khách hàng trong hệ thống |
| **Reports** | Báo cáo tổng hợp và phân tích |

### Vấn đề nghiệp vụ được giải quyết

- Thiếu tầm nhìn tổng quan về pipeline bán hàng
- Khó theo dõi tiến độ xử lý leads và deals
- Giao tiếp rời rạc giữa các thành viên trong đội ngũ
- Khó phân biệt task quan trọng và không quan trọng
- Thiếu báo cáo dữ liệu để đánh giá hiệu suất

---

## Cài đặt

### Yêu cầu

- Trình duyệt hiện đại (Chrome, Firefox, Edge, Safari)
- VS Code (tùy chọn, để sử dụng Live Server)

### Các bước cài đặt

**1. Clone repository**

```bash
git clone https://github.com/username/FlowCRM.git
```

**2. Di chuyển vào thư mục project**

```bash
cd FlowCRM/FlowCRM
```

**3. Mở project**

Cách 1 – Mở trực tiếp bằng trình duyệt:
```bash
# Mở file index.html trong thư mục FlowCRM
```

Cách 2 – Sử dụng Live Server trong VS Code:
1. Cài đặt extension **Live Server** trong VS Code
2. Click chuột phải vào file `index.html`
3. Chọn **"Open with Live Server"**

---

## Cách sử dụng

### Khám phá các tính năng

1. **KPI Dashboard** – Truy cập trang chủ để xem tổng quan các chỉ số kinh doanh
2. **Quản lý Leads & Khách hàng** – Xem và cập nhật thông tin khách hàng trong mục Customers
3. **Kanban Sales Pipeline** – Kéo thả deals qua các giai đoạn bán hàng trong Pipeline
4. **Task theo ưu tiên** – Xem và sắp xếp công việc theo mức độ ưu tiên trong Tasks
5. **Lịch hẹn** – Kiểm tra và quản lý lịch hẹn trong Calendar
6. **Tin nhắn** – Giao tiếp với khách hàng qua Messages
7. **Báo cáo** – Xem các báo cáo tổng hợp trong Reports

### Đăng nhập

Sử dụng tài khoản mặc định hoặc đăng ký tài khoản mới:
- Trang đăng nhập: `login.html`
- Trang đăng ký: `register.html`

---

## Cấu trúc project

```
FlowCRM/
├── index.html          # KPI Dashboard
├── login.html          # Trang đăng nhập
├── register.html       # Trang đăng ký
├── pipeline.html       # Kanban Sales Pipeline
├── customers.html      # Quản lý khách hàng
├── tasks.html          # Quản lý công việc
├── calendar.html       # Lịch hẹn
├── messages.html       # Tin nhắn
├── reports.html        # Báo cáo
├── settings.html       # Cài đặt
└── assets/
    ├── css/
    │   ├── styles.css        # Styles chính
    │   ├── design-system.css # Hệ thống thiết kế
    │   └── auth.css          # Styles đăng nhập/đăng ký
    └── js/
        ├── app.js            # Logic ứng dụng
        └── auth.js           # Logic xác thực
```

---

## Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Không phụ thuộc framework** – Dễ dàng mở rộng và tích hợp

## Công cụ thiết kế

- **Figma** – Thiết kế giao diện và prototype

---

## Portfolio

Project này phù hợp để showcase trong portfolio của:

- **Business Analyst** – Phân tích nghiệp vụ, thiết kế user flow và wireframe
- **UI/UX Designer** – Thiết kế giao diện, hệ thống thiết kế và prototype trên Figma
- **Front-end Developer** – Xây dựng giao diện web với HTML, CSS, JavaScript thuần

---

## Tác giả

- **Vai trò**: Business Analyst & UI/UX Designer
- **GitHub**: [username](https://github.com/username)
