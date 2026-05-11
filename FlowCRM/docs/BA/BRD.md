# FlowCRM - Business Requirements Document (BRD)

**Version:** 1.0
**Date:** 2024
**Status:** Approved

---

## 1. Executive Summary

### 1.1 Problem Statement

Các đội kinh doanh vừa và nhỏ tại Việt Nam đang đối mặt với vấn đề phân mảnh dữ liệu và thiếu trực quan trong quy trình bán hàng. Hầu hết sử dụng Excel hoặc công cụ rời rạc, dẫn đến:

- Không thể dự báo doanh thu chính xác
- Mất dấu deal quan trọng do không có quy trình chuẩn
- Khó khăn trong phân công công việc và đánh giá hiệu suất

### 1.2 Proposed Solution

FlowCRM - Trung tâm điều hành bán hàng trực quan, nơi mọi thông tin về khách hàng, cơ hội và công việc được tập trung, sắp xếp khoa học và dễ dàng hành động.

### 1.3 Business Objectives

| Objective | Target | Measurement |
|-----------|--------|-------------|
| Tăng tốc độ cập nhật deal | +30% | Thời gian cập nhật trung bình |
| Giảm thời gian tạo báo cáo | -50% | Thời gian tạo pipeline report |
| Cải thiện khả năng dự báo | Đạt 90% accuracy | So sánh forecast vs actual |

---

## 2. Scope Definition

### 2.1 In Scope (MVP)

**Core Features:**
1. Dashboard tổng quan với KPI cards
2. Pipeline Kanban Board với drag-and-drop
3. Danh sách khách hàng với search/filter
4. Quick Create Modal cho deal mới
5. Responsive design (desktop, tablet, mobile)

**User Roles:**
- Sales Representative
- Sales Manager

**Data Boundaries:**
- 1,000 customers max
- 10,000 deals max
- 5 sales pipeline stages

### 2.2 Out of Scope (Post-MVP)

- Email integration
- Calendar sync
- Advanced analytics/BI
- Mobile native apps
- Multi-tenant/White-label
- API integrations

### 2.3 Constraints

**Technical Constraints:**
- Static HTML/CSS/JS (no backend)
- GitHub Pages deployment
- No database (localStorage for demo)

**Business Constraints:**
- Single currency (VND)
- Vietnamese language only (v1.0)
- Single time zone (ICT/GMT+7)

---

## 3. Stakeholder Analysis

### 3.1 Primary Stakeholders

| Stakeholder | Role | Interest | Influence |
|-------------|------|----------|-----------|
| Sales Rep | End User | Nhanh, tiện lợi | High |
| Sales Manager | End User + Buyer | Visibility, control | High |
| CEO | Budget Owner | ROI, growth | Medium |

### 3.2 User Personas

**Persona 1: Minh - Sales Representative**
- Age: 28
- Experience: 3 năm trong ngành
- Goals: Cập nhật deal nhanh, không错过 follow-up
- Pain Points: Excel phức tạp, quên deadline
- Tech Proficiency: Cao

**Persona 2: Lan - Sales Manager**
- Age: 35
- Experience: 7 năm, quản lý team 5 người
- Goals: Overview pipeline, đánh giá performance
- Pain Points: Report thủ công, thiếu visibility
- Tech Proficiency: Trung bình

---

## 4. Functional Requirements

### 4.1 Dashboard

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| D-01 | Hiển thị 4 KPI cards | Must | Open Deals, Revenue, Conversion, New Customers |
| D-02 | Pipeline chart theo giai đoạn | Must | Bar chart với 5 stages |
| D-03 | Danh sách công việc hôm nay | Should | Hiển thị task với checkbox |
| D-04 | Hoạt động gần đây | Should | Real-time activity feed |

### 4.2 Pipeline Board

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| P-01 | 5 cột giai đoạn | Must | Qualification, Proposal, Negotiation, Closed Won, Closed Lost |
| P-02 | Drag-drop cards | Must | Kéo deal giữa các cột |
| P-03 | Hiển thị thông tin deal | Must | Tên, giá trị, khách hàng, ưu tiên |
| P-04 | Đếm số deal trong cột | Must | Tự động cập nhật khi di chuyển |

### 4.3 Customer List

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| C-01 | Bảng dữ liệu khách hàng | Must | 8 columns: name, company, email, phone, status, latest deal |
| C-02 | Search/Filter | Must | Tìm theo tên, email, công ty |
| C-03 | Inline edit | Should | Double-click để sửa |
| C-04 | Pagination | Should | 8 rows/page |

### 4.4 Quick Create Modal

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| Q-01 | Form tạo deal nhanh | Must | Tên, giá trị, giai đoạn, khách hàng, ưu tiên |
| Q-02 | Real-time validation | Must | Check required fields |
| Q-03 | Keyboard shortcut | Should | Ctrl+N để mở |
| Q-04 | Auto-focus on open | Must | Cursor vào field đầu tiên |

---

## 5. Non-Functional Requirements

### 5.1 Performance

- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90

### 5.2 Usability

- Learning curve < 30 phút
- Task success rate > 95%
- User satisfaction > 4/5

### 5.3 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Color contrast ratio > 4.5:1

### 5.4 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 6. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | User training, clear UX |
| Performance issues | Medium | Low | Optimize CSS, lazy load |
| Data loss (localStorage) | High | Low | Export functionality |
| Scope creep | High | Medium | Clear requirements, change control |

---

## 7. Success Metrics

### 7.1 KPIs

| Metric | Baseline | Target | Date |
|--------|----------|--------|------|
| Time to update deal | 5 min | 3.5 min | Month 3 |
| Report generation | 20 min | 10 min | Month 3 |
| Pipeline visibility | 60% | 90% | Month 6 |

### 7.2 Go-Live Criteria

- [ ] All 4 screens implemented and functional
- [ ] Drag-drop working on all browsers
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Demo data populated