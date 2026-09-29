# Galaxy CTF

CTF web app chủ đề đài quan sát thiên văn, thiết kế để chạy trong Docker sandbox.

## Chạy

```bash
docker compose up --build
```

Mở `http://127.0.0.1:8000/login`. Nginx gateway publish cổng trên loopback máy host rồi chuyển request vào app. App chính vẫn chỉ nằm trên Docker network `challenge` cô lập; SSRF được mô phỏng bằng router nội bộ, không fetch URL ra mạng.

Tài khoản user mẫu: `astronaut` / `orbit123`. Admin seed dùng `ADMIN_PASSWORD` trong compose; SQLite lưu trong named volume `galaxy-store`.

## Các chặng

1. `/dashboard` có HTML comment gợi ý `/feed`. Endpoint này nhận URL nội bộ dạng `http://127.0.0.1:3000/...` và mô phỏng response của console, không mở kết nối mạng.
2. Console mô phỏng có `GET /health`, `GET /feed` và `GET hoặc POST /report?search=...`. Truy vấn report cố ý nối chuỗi SQL; có thể thử UNION query với `sqlite_master` để xem schema SQLite.
3. Đăng nhập admin mở `/admin`. Form export ghi HTML vào file tạm rồi gọi `wkhtmltopdf` với local file access bật; flag nằm tại `/flag.txt` trong container, ngoài webroot.

Các lỗ hổng có chủ đích được đánh dấu `// VULN:` trong source.
