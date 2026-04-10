# Mini Food Ordering System - Service-Based Architecture

Dự án này là một hệ thống đặt món ăn thu nhỏ được xây dựng theo kiến trúc Service-Based.

## Cấu trúc dự án

Dự án bao gồm các dịch vụ sau:

1.  **user-service** (Port: 8081): Quản lý người dùng, đăng ký, đăng nhập.
2.  **food-service** (Port: 8082): Quản lý thực đơn và món ăn.
3.  **order-service** (Port: 8083): Quản lý đơn hàng, kết nối User và Food service.
4.  **payment-service** (Port: 8084): Giả lập thanh toán và gửi thông báo.
5.  **frontend**: Giao diện người dùng Web (ReactJS + Axios).

## Công nghệ sử dụng

-   **Backend**: Java 17+, Spring Boot 3.x, Spring Data JPA, H2 Database.
-   **Frontend**: ReactJS, Vite, Axios, Vanilla CSS.
-   **Giao tiếp**: REST API (HTTP).

## Hướng dẫn chạy nhanh

### Cấu hình IP
Trước khi chạy, hãy đảm bảo cập nhật địa chỉ IP của máy bạn trong các file cấu hình `application.properties` của từng service và file `.env` của frontend (nếu có). 
Giá trị hiện tại đang được cấu hình là: `192.168.1.118` (Vui lòng thay đổi theo IP máy bạn).

### 1. Chạy các dịch vụ Backend
Di chuyển vào từng thư mục service và chạy lệnh:
```bash
mvn spring-boot:run
```

### 2. Chạy Frontend
Di chuyển vào thư mục frontend:
```bash
npm install
npm run dev
```

## Kịch bản Demo (Test Flow)
1. Đăng ký tài khoản mới và Đăng nhập.
2. Xem danh sách món ăn từ Food Service.
3. Thêm món vào giỏ hàng và thực hiện Đặt hàng (Tạo Order).
4. Thực hiện thanh toán giả lập.
5. Kiểm tra thông báo (console log) về đơn hàng thành công.
