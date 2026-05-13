# FlowCRM

## Cách chạy project

Đây là project web tĩnh, không cần build hay cài đặt dependencies.

### Cách 1: Mở trực tiếp bằng trình duyệt
1. Mở file `FlowCRM/index.html` trong trình duyệt (Chrome, Firefox, Edge,...)

### Cách 2: Sử dụng local server (khuyến nghị)
Sử dụng Python hoặc Node.js để chạy local server:

**Python:**
```bash
cd FlowCRM
python -m http.server 8000
```
Sau đó mở http://localhost:8000

**Node.js (npx):**
```bash
cd FlowCRM
npx serve
```

**VS Code:**
Cài đặt extension "Live Server", click chuột phải vào `index.html` → "Open with Live Server"

## Cấu trúc thư mục

```
FlowCRM/
├── index.html        # Dashboard
├── pipeline.html    # Pipeline deals (Kanban board)
├── customers.html   # Quản lý khách hàng
├── tasks.html      # Nhiệm vụ
├── calendar.html   # Lịch hẹn
├── messages.html   # Tin nhắn
└── assets/
    ├── css/
    │   ├── design-system.css  # Design system (biến CSS)
    │   └── styles.css         # Custom styles
    └── js/
        └── app.js            # JavaScript
```

## Tính năng

- **Dashboard**: KPI, biểu đồ pipeline, công việc hôm nay, hoạt động gần đây
- **Pipeline**: Kanban board với drag & drop, tạo deal mới
- **Khách hàng**: Bảng khách hàng, thêm/sửa/xóa, tìm kiếm
- **Nhiệm vụ**: Danh sách nhiệm vụ theo ngày, filter, tạo mới
- **Lịch hẹn**: Calendar view, danh sách lịch hẹn sắp tới
- **Tin nhắn**: Chat interface, gửi tin nhắn mới