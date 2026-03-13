# 🚀 CMS React + Node.js + MySQL Docker System

Hệ thống quản lý nội dung (Content Management System) đơn giản được xây dựng theo kiến trúc **Layer Architecture** và **Microkernel Architecture**, sử dụng công nghệ:
- Môi trường chạy: **Docker Compose**
- Frontend: **React JS (Vite) + Tailwind CSS**
- Backend: **Node.js + Express**
- Database: **MySQL 8**

---

## 🛠️ Yêu cầu trước khi cài đặt
- Phải có [Docker Desktop](https://www.docker.com/products/docker-desktop) cài trên máy và đang bật.
- Cổng (Port) `3002`, `3001` và `3307` trên máy phải đang trống (không bị ứng dụng khác chiếm dụng).

---

## 🚀 Hướng Dẫn Khởi Chạy

### Cách 1: Chạy bằng Terminal/CMD (Khuyến nghị)

1. Mở **Terminal**, **CMD** hoặc bảng **PowerShell**.
2. Di chuyển vào thư mục dự án này bằng lệnh `cd`:
   ```bash
   cd "d:\TH KTTKHT\week04_layer_microkernel_docker"
   ```
3. Chạy lệnh dựng hệ thống:
   ```bash
   docker-compose up --build
   ```
   > ⏳ *Mất khoảng 1 - 3 phút cho lần chạy đầu tiên để Docker tự build các file NodeJS packages và nạp Database `init.sql`.*

### Cách 2: Chạy bằng giao diện Docker Desktop

1. Mở ứng dụng **Docker Desktop**.
2. Nếu bạn dùng VS Code, hãy click chuột phải vào file `docker-compose.yml` và chọn **Compose Up**.
3. Bạn cũng có thể kéo thả thư mục vào phần giao diện của Docker để nó tự chạy.

---

## 🌐 Các Đường Link Quan Trọng
Sau khi Terminal báo `VITE ready` và `Backend server running`, hãy mở trình duyệt lên và vào các địa chỉ sau:

- 🖥️ **Giao diện quản lý CMS (Frontend)**: [http://localhost:3002](http://localhost:3002)
- 🔌 **API Backend Endpoint**: [http://localhost:3001/posts](http://localhost:3001/posts)

---

## 🗄️ Thông Tin Database
MySQL đã được cấu hình chạy ngầm. Cổng truy cập là `3307` (đã map port để không lấn át MySQL mặc định của windows):

- **Host:** `localhost`
- **Port:** `3307`
- **Username:** `root`
- **Password:** `rootpassword`
- **Database Name:** `cms_db`
> *(Hệ thống tự động nạp sẵn 2 bài viết và tài khoản "admin" khi DB vừa mới khởi tạo)*.

---

## 🛑 Cách Dừng Server

Thao tác tại cửa sổ Terminal đang chạy Docker:
1. Nhấn tổ hợp phím **`Ctrl + C`**.
2. Nếu muốn tắt server và dọn luôn dữ liệu Database (reset về rỗng):
   ```bash
   docker-compose down -v
   ```
