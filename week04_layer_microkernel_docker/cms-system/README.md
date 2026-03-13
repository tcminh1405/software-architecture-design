# Hệ Thống CMS - Content Management System

Hệ thống CMS đơn giản được xây dựng với kiến trúc Layer và Microkernel, sử dụng React, Node.js, Express và MySQL.

## 📋 Mục Lục

- [Tính Năng](#tính-năng)
- [Kiến Trúc](#kiến-trúc)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt và Chạy](#cài-đặt-và-chạy)
- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [API Endpoints](#api-endpoints)
- [Tài Khoản Demo](#tài-khoản-demo)

## ✨ Tính Năng

### 1. Quản Lý Bài Viết
- ✅ Tạo bài viết mới (Create)
- ✅ Xem danh sách bài viết (Read)
- ✅ Chỉnh sửa bài viết (Update)
- ✅ Xóa bài viết (Delete)

### 2. Quản Lý Người Dùng
- ✅ 3 vai trò: Admin, Editor, Viewer
- ✅ Phân quyền theo vai trò
- ✅ Xác thực JWT

### 3. Xuất Bản Bài Viết
- ✅ Draft (Bản nháp)
- ✅ Pending (Chờ duyệt)
- ✅ Published (Đã xuất bản)

## 🏗️ Kiến Trúc

### Layer Architecture
```
┌─────────────────────────────────┐
│   Presentation Layer (React)    │
├─────────────────────────────────┤
│   API Layer (Express REST API)  │
├─────────────────────────────────┤
│   Business Logic Layer          │
├─────────────────────────────────┤
│   Database Layer (MySQL)        │
└─────────────────────────────────┘
```

### Microkernel Architecture
- Core System: Authentication, Post Management, User Management
- Plugin Interface: Hỗ trợ mở rộng chức năng

## 💻 Yêu Cầu Hệ Thống

- Docker Desktop (phiên bản mới nhất)
- Docker Compose
- Git

## 🚀 Cài Đặt và Chạy

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd cms-system
```

### Bước 2: Chạy với Docker Compose
```bash
docker-compose up --build
```

Lệnh này sẽ:
- Build và khởi động MySQL database
- Build và khởi động Backend API (Node.js + Express)
- Build và khởi động Frontend (React + Vite)

### Bước 3: Truy Cập Ứng Dụng

Sau khi các container đã chạy thành công:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

### Bước 4: Đăng Nhập

Sử dụng một trong các tài khoản demo:

| Username | Password  | Role   |
|----------|-----------|--------|
| admin    | admin123  | Admin  |
| editor   | admin123  | Editor |
| viewer   | admin123  | Viewer |

## 📁 Cấu Trúc Thư Mục

```
kiro/
├── backend/                 # Backend Node.js + Express
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes
│   ├── server.js           # Entry point
│   ├── Dockerfile          # Backend Docker config
│   └── package.json        # Dependencies
│
├── frontend/               # Frontend React + Vite
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── Dockerfile         # Frontend Docker config
│   ├── nginx.conf         # Nginx configuration
│   └── package.json       # Dependencies
│
├── database/              # Database scripts
│   └── init.sql          # Initial schema and data
│
├── docker-compose.yml    # Docker Compose config
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login
Body: { "username": "admin", "password": "admin123" }
Response: { "token": "jwt-token", "user": {...} }
```

### Posts Management
```
GET    /api/posts              # Lấy danh sách bài viết
GET    /api/posts/:id          # Lấy chi tiết bài viết
POST   /api/posts              # Tạo bài viết mới
PUT    /api/posts/:id          # Cập nhật bài viết
DELETE /api/posts/:id          # Xóa bài viết
```

**Headers cho các API cần authentication:**
```
Authorization: Bearer <jwt-token>
```

## 🎯 Tài Khoản Demo

### Admin
- Username: `admin`
- Password: `admin123`
- Quyền: Toàn quyền (CRUD posts, manage users)

### Editor
- Username: `editor`
- Password: `admin123`
- Quyền: Tạo và chỉnh sửa bài viết của mình

### Viewer
- Username: `viewer`
- Password: `admin123`
- Quyền: Chỉ xem bài viết đã xuất bản

## 🛠️ Development

### Chạy Backend Locally (không dùng Docker)
```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với thông tin database
npm run dev
```

### Chạy Frontend Locally (không dùng Docker)
```bash
cd frontend
npm install
npm run dev
```

## 🐛 Troubleshooting

### Container không khởi động
```bash
# Xóa containers và volumes cũ
docker-compose down -v

# Build lại từ đầu
docker-compose up --build
```

### Database connection error
```bash
# Kiểm tra MySQL container đã chạy chưa
docker ps

# Xem logs của MySQL
docker logs cms-mysql

# Đợi MySQL khởi động hoàn toàn (khoảng 30 giây)
```

### Port đã được sử dụng
Nếu port 3000, 8080 hoặc 3306 đã được sử dụng, chỉnh sửa trong `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Thay đổi port bên trái
```

## 📝 Notes

- Database được khởi tạo tự động với schema và sample data
- JWT token có thời hạn 24 giờ
- Passwords được hash bằng bcrypt
- Frontend sử dụng TailwindCSS cho styling

## 🔒 Security Notes

⚠️ **Quan trọng**: Đây là project demo, không sử dụng trong production mà không:
- Thay đổi JWT_SECRET
- Thay đổi database passwords
- Thêm HTTPS
- Thêm rate limiting
- Validate và sanitize inputs

## 📄 License

MIT License
