# Galaxy CTF

Galaxy CTF là một web lab CTF chủ đề thiên văn học, xây dựng để luyện tập và tìm hiểu cách hoạt động của các lỗ hổng web trong môi trường sandbox. Ứng dụng có trang đăng nhập, dashboard lưu trữ bài viết thiên văn và khu vực quản trị dành cho các chặng thử thách.

## Mục đích dự án

Project giúp thực hành:

- Luồng HTTP request/response và cách Express xử lý route, middleware.
- Tương tác giữa ứng dụng Node.js và cơ sở dữ liệu SQLite.
- Phân tích các lỗ hổng SSRF, SQL Injection và đọc file cục bộ qua trình kết xuất PDF.
- Tổ chức một ứng dụng CTF nhiều chặng trong môi trường Docker cô lập.

## Công nghệ sử dụng

- **Backend:** Node.js, Express.js
- **Template:** EJS
- **Database:** SQLite (`sqlite3`)
- **Session:** `express-session`
- **Triển khai lab:** Docker Compose, Nginx và `wkhtmltopdf`

## Các chặng thử thách

> Các lỗ hổng dưới đây được cài đặt có chủ đích để phục vụ bài tập.

### 1. SSRF mô phỏng qua `/feed`

Dashboard có HTML comment gợi ý về endpoint `/feed`. Endpoint này nhận URL của internal ops console và chuyển tiếp yêu cầu tới các route nội bộ được mô phỏng trong ứng dụng.

**Lưu ý:** Đây là SSRF mô phỏng bằng router nội bộ; ứng dụng không thực hiện request mạng tới URL tùy ý.

### 2. SQL Injection tại chức năng tìm kiếm report

Internal console có chức năng `/report?search=<term>`. Giá trị tìm kiếm được nối trực tiếp vào truy vấn SQLite để người chơi thực hành SQL Injection, bao gồm truy vấn metadata trong `sqlite_master`.

### 3. Đăng nhập admin và xuất PDF

Sau khi đăng nhập bằng tài khoản admin, người chơi có thể gửi HTML tới chức năng xuất PDF. Server dùng `wkhtmltopdf` với quyền đọc file cục bộ được bật; đây là chặng luyện tập đọc file qua PDF renderer.

## Cấu trúc dự án

```text
galaxy-app/
├── controllers/       # Xử lý logic cho các trang và xuất PDF
├── database/          # Khởi tạo SQLite, seed dữ liệu và truy vấn
├── internal/          # Các endpoint của internal ops console mô phỏng
├── middleware/        # Kiểm tra session và quyền admin
├── routes/            # Định nghĩa route của ứng dụng
├── views/             # Các trang EJS
├── app.js             # Cấu hình Express và middleware
├── server.js          # Entry point
├── Dockerfile         # Image ứng dụng
├── docker-compose.yml  # Khởi chạy lab và Nginx gateway
└── flag.example.txt   # Flag mẫu để tạo flag riêng khi chạy local
```

## Chạy bằng Docker

Từ thư mục `galaxy-app`, nếu chưa có file flag riêng, tạo file local từ mẫu:

```powershell
if (-not (Test-Path .\flag.txt)) {
  Copy-Item .\flag.example.txt .\flag.txt
}
docker compose up --build
```

Sau khi khởi động, mở [http://127.0.0.1:8000/login](http://127.0.0.1:8000/login). Có thể sửa nội dung `flag.txt` để đặt flag riêng. File này được Git bỏ qua, không nên commit flag thật lên repository.

Tài khoản user mẫu: `astronaut / orbit123`. Dữ liệu SQLite được lưu trong Docker volume `galaxy-store`.

## Cảnh báo bảo mật

Source chứa các lỗ hổng bảo mật có chủ đích. Chỉ chạy trong sandbox/local lab do bạn kiểm soát; không triển khai trực tiếp lên production, máy chủ công khai hoặc hệ thống của người khác.
