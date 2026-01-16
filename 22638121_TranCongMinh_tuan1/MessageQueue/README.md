# Ứng dụng Chat với Redis Message Queue

Ứng dụng chat sử dụng Redis Message Queue để giao tiếp giữa 2 services:
- **Service Producer** (port 8080): Gửi tin nhắn qua Redis
- **Service Consumer** (port 8081): Nhận và xử lý tin nhắn từ Redis

## Yêu cầu

- Java 17+
- Maven 3.6+
- Redis Server (chạy trên localhost:6379)

## Cài đặt và Chạy

### 1. Cài đặt và khởi động Redis

**Windows:**
- Tải Redis từ: https://github.com/microsoftarchive/redis/releases
- Hoặc sử dụng Docker: `docker run -d -p 6379:6379 redis:latest`

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Mac (với Homebrew)
brew install redis
brew services start redis
```

### 2. Khởi động Service Consumer (port 8081)

```bash
cd service-consumer
mvn spring-boot:run
```

Service Consumer sẽ lắng nghe tin nhắn từ Redis.

### 3. Khởi động Service Producer (port 8080)

```bash
cd service-producer
mvn spring-boot:run
```

Service Producer sẽ cung cấp giao diện web và API để gửi tin nhắn.

### 4. Test ứng dụng

Sử dụng curl hoặc script test:

**Windows:**
```bash
test-chat.bat
```

**Linux/Mac:**
```bash
chmod +x test-chat.sh
./test-chat.sh
```

**Hoặc test thủ công bằng curl:**

Gửi tin nhắn:
```bash
curl -X POST http://localhost:8080/api/chat/send \
  -H "Content-Type: application/json" \
  -d "{\"sender\":\"User1\",\"content\":\"Xin chào!\"}"
```

Lấy danh sách tin nhắn:
```bash
curl http://localhost:8081/api/chat/messages
```

## Kiến trúc

```
┌─────────────────┐         ┌─────────┐         ┌─────────────────┐
│ Service Producer│  ────>  │  Redis  │  ────>  │ Service Consumer│
│   (Port 8080)   │  Publish│ Pub/Sub │  Listen │   (Port 8081)   │
└─────────────────┘         └─────────┘         └─────────────────┘
```

1. **Service Producer** nhận tin nhắn từ người dùng qua REST API
2. **Service Producer** publish tin nhắn vào Redis channel `chat:messages`
3. **Service Consumer** lắng nghe Redis channel và nhận tin nhắn
4. **Service Consumer** lưu trữ tin nhắn và cung cấp API để lấy danh sách tin nhắn

## API Endpoints

### Service Producer (http://localhost:8080)

- `POST /api/chat/send` - Gửi tin nhắn
  ```json
  {
    "sender": "User1",
    "content": "Xin chào!"
  }
  ```

### Service Consumer (http://localhost:8081)

- `GET /api/chat/messages` - Lấy tất cả tin nhắn
- `DELETE /api/chat/messages` - Xóa tất cả tin nhắn

## Cấu trúc Project

```
MessageQueue/
├── service-producer/
│   ├── src/main/java/.../serviceproducer/
│   │   ├── config/RedisConfig.java      # Cấu hình Redis
│   │   ├── controller/ChatController.java
│   │   ├── model/Message.java
│   │   └── service/MessagePublisher.java
│   └── src/main/resources/
│       └── application.properties
│
└── service-consumer/
    ├── src/main/java/.../serviceconsumer/
    │   ├── config/RedisConfig.java      # Cấu hình Redis + Listener
    │   ├── controller/ChatController.java
    │   ├── model/Message.java
    │   └── service/MessageListener.java
    └── src/main/resources/
        └── application.properties
```

## Tính năng

- ✅ Gửi tin nhắn real-time qua Redis Pub/Sub
- ✅ REST API để gửi và nhận tin nhắn
- ✅ Logging chi tiết trên console
- ✅ Xóa lịch sử tin nhắn
- ✅ Hỗ trợ nhiều người dùng
- ✅ Test scripts cho Windows và Linux/Mac

## Lưu ý

- Đảm bảo Redis đang chạy trước khi khởi động các services
- Service Consumer phải được khởi động trước Service Producer để có thể nhận tin nhắn ngay lập tức
- Tin nhắn được lưu trong memory của Service Consumer, sẽ mất khi restart service
