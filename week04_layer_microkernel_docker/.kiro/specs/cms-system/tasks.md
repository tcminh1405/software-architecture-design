# Implementation Tasks - Hệ Thống CMS

## 1. Setup Project Structure
- [ ] 1.1 Tạo thư mục dự án với cấu trúc frontend, backend, database
- [ ] 1.2 Khởi tạo Git repository và .gitignore

## 2. Backend Setup (Node.js + Express)
- [ ] 2.1 Khởi tạo Node.js project với npm init
- [ ] 2.2 Cài đặt dependencies: express, mysql2, bcryptjs, jsonwebtoken, dotenv, cors
- [ ] 2.3 Tạo cấu trúc thư mục backend (controllers, services, routes, middleware, config)
- [ ] 2.4 Tạo file cấu hình database connection
- [ ] 2.5 Tạo file server.js với Express setup

## 3. Database Setup (MySQL)
- [ ] 3.1 Tạo database schema SQL file
  - [ ] 3.1.1 Tạo bảng users
  - [ ] 3.1.2 Tạo bảng posts
  - [ ] 3.1.3 Tạo bảng categories
  - [ ] 3.1.4 Tạo bảng post_categories
  - [ ] 3.1.5 Tạo indexes và foreign keys
- [ ] 3.2 Tạo seed data cho testing

## 4. Backend API Implementation
- [ ] 4.1 Implement Authentication
  - [ ] 4.1.1 Tạo auth middleware với JWT verification
  - [ ] 4.1.2 Tạo role-based access control middleware
  - [ ] 4.1.3 Implement POST /api/auth/login endpoint
- [ ] 4.2 Implement Posts API
  - [ ] 4.2.1 Implement POST /api/posts (Create post)
  - [ ] 4.2.2 Implement GET /api/posts (List posts with pagination)
  - [ ] 4.2.3 Implement GET /api/posts/:id (Get single post)
  - [ ] 4.2.4 Implement PUT /api/posts/:id (Update post)
  - [ ] 4.2.5 Implement DELETE /api/posts/:id (Delete post)
- [ ] 4.3 Implement Users API
  - [ ] 4.3.1 Implement POST /api/users (Create user)
  - [ ] 4.3.2 Implement GET /api/users (List users)
  - [ ] 4.3.3 Implement PATCH /api/users/:id/role (Change role)
- [ ] 4.4 Implement Categories API
  - [ ] 4.4.1 Implement GET /api/categories (List categories)
  - [ ] 4.4.2 Implement POST /api/categories (Create category)

## 5. Frontend Setup (React + Vite + TailwindCSS)
- [ ] 5.1 Khởi tạo Vite React project
- [ ] 5.2 Cài đặt và cấu hình TailwindCSS
- [ ] 5.3 Cài đặt dependencies: react-router-dom, axios
- [ ] 5.4 Tạo cấu trúc thư mục (components, pages, services, utils)
- [ ] 5.5 Tạo API service layer với axios

## 6. Frontend Components Implementation
- [ ] 6.1 Implement Authentication UI
  - [ ] 6.1.1 Tạo Login page
  - [ ] 6.1.2 Tạo AuthContext cho state management
  - [ ] 6.1.3 Implement protected routes
- [ ] 6.2 Implement Posts Management UI
  - [ ] 6.2.1 Tạo Posts List page với pagination
  - [ ] 6.2.2 Tạo Create Post form
  - [ ] 6.2.3 Tạo Edit Post form
  - [ ] 6.2.4 Tạo Post detail view
  - [ ] 6.2.5 Implement delete post functionality
- [ ] 6.3 Implement Users Management UI (Admin only)
  - [ ] 6.3.1 Tạo Users List page
  - [ ] 6.3.2 Tạo Create User form
  - [ ] 6.3.3 Implement role change functionality
- [ ] 6.4 Implement Navigation và Layout
  - [ ] 6.4.1 Tạo Header component với navigation
  - [ ] 6.4.2 Tạo Sidebar component
  - [ ] 6.4.3 Tạo Layout wrapper

## 7. Docker Configuration
- [ ] 7.1 Tạo Dockerfile cho Backend
  - [ ] 7.1.1 Setup Node.js base image
  - [ ] 7.1.2 Copy dependencies và source code
  - [ ] 7.1.3 Expose port 3000
- [ ] 7.2 Tạo Dockerfile cho Frontend
  - [ ] 7.2.1 Setup Node.js build stage
  - [ ] 7.2.2 Setup Nginx serve stage
  - [ ] 7.2.3 Expose port 8080
- [ ] 7.3 Tạo docker-compose.yml
  - [ ] 7.3.1 Configure MySQL service với volume
  - [ ] 7.3.2 Configure backend service với environment variables
  - [ ] 7.3.3 Configure frontend service
  - [ ] 7.3.4 Setup networks và dependencies

## 8. Testing và Documentation
- [ ] 8.1 Viết README.md với hướng dẫn setup và chạy
- [ ] 8.2 Test API endpoints với Postman/Thunder Client
- [ ] 8.3 Test frontend flows
- [ ] 8.4 Tạo file .env.example

## 9. Deployment
- [ ] 9.1 Build và test Docker containers locally
- [ ] 9.2 Verify database migrations
- [ ] 9.3 Test toàn bộ hệ thống với docker-compose up
