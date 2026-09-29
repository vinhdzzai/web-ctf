# Web CTF Labs

This repository contains two standalone educational CTF labs:

- [travell-app](travell-app/) — the original web security lab.
- [galaxy-app](galaxy-app/) — the astronomy-themed SSRF, SQL injection, and PDF export lab.

Each application has its own setup instructions and dependencies.

---

# Travell App

Một ứng dụng web **full-stack cơ bản** được xây dựng nhằm phục vụ mục đích học tập, tìm hiểu về kiến trúc ứng dụng web và luồng xử lý giữa **Client ↔ Server ↔ Database** chứ không chứng tỏ năng lực code.

---

##  Mục Đích Dự Án

Project được xây dựng nhằm thực hành và làm sáng tỏ các khái niệm:

-  **HTTP Request / Response Lifecycle:** Luồng truyền tải và xử lý dữ liệu giữa client và backend.
-  **Express Routing & Middleware:** Cách Express.js điều hướng route, tổ chức middleware và xử lý request.
-  **Backend & Database Interaction:** Cơ chế tương tác, truy vấn và lưu trữ dữ liệu với SQLite.
-  **Web Security Vulnerabilities:** Mô phỏng thực tế cơ chế hoạt động của các lỗ hổng web phổ biến trong môi trường local.
---

##  Công Nghệ Sử Dụng

- **Backend:** Node.js, Express.js
- **Database:** SQLite (`sqlite3`)
- **Frontend:** HTML, CSS, JavaScript

---

##  Mô Phỏng Các Lỗ Hổng Bảo Mật

>  **Lưu ý:** Các lỗ hổng được triển khai **có chủ đích** nhằm mục đích nghiên cứu và thực hành kiểm thử bảo mật (Pentesting / Code Review).

### 1. 💉 SQL Injection (SQLi)
- **Mô tả:** Ứng dụng chứa truy vấn SQL không được tham số hóa (*parameterized queries*), trực tiếp nối chuỗi dữ liệu đầu vào của người dùng.
- **Tác động:** Cho phép người dùng thao túng câu truy vấn, vượt qua cơ chế xác thực hoặc truy xuất trái phép dữ liệu trong database.

### 2. 📜 Cross-Site Scripting (XSS)
- **Mô tả:** Dữ liệu do người dùng nhập vào được phản hồi hoặc hiển thị trực tiếp lên giao diện mà không qua bộ lọc/mã hóa (*sanitize / encode*).
- **Tác động:** Cho phép chèn và thực thi mã JavaScript tùy chỉnh trên trình duyệt của người dùng.

### 3. 📁 Path Traversal
- **Mô tả:** Cơ chế kiểm tra đường dẫn file (`path validation`) không đầy đủ khi xử lý đọc hoặc tải file.
- **Tác động:** Cho phép truy cập và đọc các file nhạy cảm nằm ngoài thư mục web gốc (`root directory`).

---

## 📂 Cấu Trúc Dự Án

```text
travell-app/
├── 📁 controllers/      # Bộ điều khiển xử lý logic cho từng route
├── 📁 database/         # File khởi tạo và kết nối cơ sở dữ liệu SQLite
├── 📁 middleware/       # Các hàm trung gian (xác thực, logging, v.v.)
├── 📁 public/           # Tài nguyên tĩnh (CSS, JS client, images)
├── 📁 routes/           # Định nghĩa các tuyến đường (endpoints)
├── 📁 store/            # Lưu trữ file / dữ liệu tạm thời
├── 📁 tests/            # Các kịch bản test hoặc script khai thác
├── 📁 views/            # Giao diện HTML / Template engine
├── 📄 app.js            # Khởi tạo ứng dụng Express & cài đặt middleware
├── 📄 server.js         # Entry point chính để khởi chạy HTTP server
├── 📄 package.json      # Khai báo thông tin dự án & dependencies
└── 📄 package-lock.json # Quản lý phiên bản chi tiết của dependencies
```

---


##  Ghi Chú 

- **AI Support:** AI được sử dụng như một công cụ hỗ trợ trong quá trình phát triển dự án (hỗ trợ viết code, debug, tối ưu cấu trúc và giải thích chuyên sâu các vấn đề kỹ thuật).
- **Trọng tâm học tập:** Mục tiêu chính của project là xây dựng mô hình thực hành trực quan, giúp hiểu sâu về kiến trúc ứng dụng web full-stack cũng như cơ chế phát sinh và phòng chống lỗ hổng bảo mật.

---

##  Cảnh Báo Bảo Mật (Disclaimer)

>  **CHÚ Ý:** Dự án này chứa mã nguồn có **lỗ hổng bảo mật cố ý**.
> 
> - **KHÔNG** triển khai (*deploy*) ứng dụng này lên môi trường Production, máy chủ công khai hoặc các dịch vụ Cloud.
> - **CHỈ** sử dụng và thử nghiệm trong môi trường **Local Isolation** (máy cá nhân).
> - Tác giả không chịu trách nhiệm đối với bất kỳ hành vi sử dụng sai mục đích nào ngoài phạm vi học tập và nghiên cứu.
