# Mẫu Kiến trúc Space-Based (SBA)

Dự án này minh họa kiến trúc được hiển thị trong sơ đồ, tập trung vào các mô hình **CQRS**, **Messaging Grid** (Lưới tin nhắn) và **Data Grid** (Lưới dữ liệu).

## 🗺️ Đối chiếu Kiến trúc

| Thành phần trong sơ đồ | Vị trí triển khai | Mô tả |
| :--- | :--- | :--- |
| **UI - Postman** | `test.js` / Postman | Giả lập các yêu cầu từ phía người dùng. |
| **BE** | `api-gateway/index.js` | Điểm đầu vào, điều hướng lệnh ghi tới MQ và đọc từ Redis. |
| **write-mq** | RabbitMQ (hàng đợi `write-mq`) | Vùng đệm bất đồng bộ cho các tác vụ ghi dữ liệu. |
| **write-services** | `write-service/index.js` | Đơn vị xử lý (PU) thực hiện lưu dữ liệu và làm nóng cache. |
| **Redis Server** | Redis (Data Grid) | Cung cấp khả năng đọc tốc độ cao (Mục tiêu: 100.000 r/s). |
| **Database (Hình trụ)** | PostgreSQL | Nguồn dữ liệu tin cậy cuối cùng để lưu trữ bền vững. |

## 🚀 Cách Chạy Dự Án

### 1. Khởi động Hạ tầng
Đảm bảo bạn đã cài đặt và đang chạy Docker.
```bash
docker-compose up -d
```

### 2. Chạy các Dịch vụ
Mở hai cửa sổ terminal riêng biệt:

**Terminal 1 (Dịch vụ Ghi - Write Service):**
```bash
node write-service/index.js
```

**Terminal 2 (API Gateway):**
```bash
node api-gateway/index.js
```

### 3. Chạy Bản Demo
Trong cửa sổ terminal thứ ba:
```bash
node test.js
```

## 🧠 Giải thích các Mô hình Chính

### 1. CQRS (Phân tách Trách nhiệm Lệnh và Truy vấn)
Luồng **Ghi** (POST) và luồng **Đọc** (GET) được xử lý tách biệt. Lệnh ghi đi qua hàng đợi để đảm bảo tính nhất quán sau cùng và giảm tải cho hệ thống, trong khi lệnh đọc đi qua bộ nhớ đệm tốc độ cao.

### 2. Data Grid (Redis)
Phần "Redis Server -> 100.000r/s" trong sơ đồ được hiện thực hóa bằng việc `api-gateway` kiểm tra Redis trước. Nếu dữ liệu tồn tại, nó sẽ bỏ qua hoàn toàn việc truy cập Database.

### 3. Messaging Grid (RabbitMQ)
Đóng vai trò là "Messaging Grid" và "write-mq". Nó đảm bảo rằng ngay cả khi Database chậm hoặc dịch vụ ghi bị quá tải, API Gateway vẫn luôn phản hồi nhanh chóng với người dùng.
