# Ứng dụng Chat Console với Redis Message Queue (Node.js)

Ứng dụng chat đơn giản qua console sử dụng Redis Message Queue để giao tiếp giữa 2 services:
- **Service Producer**: Nhập tin nhắn từ console và push vào Redis
- **Service Consumer**: Nhận và hiển thị tin nhắn từ Redis trên console

## Yêu cầu

- Node.js 18+ (hỗ trợ ES modules)
- npm hoặc yarn
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

### 2. Cài đặt dependencies

**Service Producer:**
```bash
cd service-producer
npm install
```

**Service Consumer:**
```bash
cd service-consumer
npm install
```

### 3. Khởi động Service Consumer

**Quan trọng:** Khởi động Service Consumer trước để lắng nghe tin nhắn từ Redis.

```bash
cd service-consumer
npm start
```

Service Consumer sẽ hiển thị:
```
Đã kết nối Redis thành công!
========================================
   SERVICE CONSUMER - CHAT CONSOLE
========================================
Đang lắng nghe tin nhắn từ Redis...
(Nhấn Ctrl+C để dừng)
----------------------------------------

>>> Đang chờ tin nhắn... 
```

### 4. Khởi động Service Producer

Trong terminal mới:
```bash
cd service-producer
npm start
```

Service Producer sẽ yêu cầu nhập tên:
```
Đã kết nối Redis thành công!
========================================
   SERVICE PRODUCER - CHAT CONSOLE
========================================
Nhập tên của bạn: [Nhập tên]
Bắt đầu chat! (Gõ 'exit' để thoát)
Bạn là: [Tên của bạn]
----------------------------------------

[YourName]: 
```

### 5. Sử dụng

1. Nhập tên của bạn trong Service Producer
2. Gõ tin nhắn và nhấn Enter
3. Tin nhắn sẽ được hiển thị trên Service Consumer
4. Gõ `exit` để thoát Service Producer

**Ví dụ:**

**Service Producer:**
```
[Alice]: Xin chào mọi người!
[Alice]: Đây là tin nhắn test
[Alice]: exit
```

**Service Consumer:**
```
>>> Nhận tin nhắn mới:
    [2024-01-23T10:30:15.123Z] Alice: Xin chào mọi người!
>>> Đang chờ tin nhắn... 
>>> Nhận tin nhắn mới:
    [2024-01-23T10:30:20.456Z] Alice: Đây là tin nhắn test
>>> Đang chờ tin nhắn... 
```

## Kiến trúc

```
┌─────────────────┐         ┌─────────┐         ┌─────────────────┐
│ Service Producer│  ────>  │  Redis  │  ────>  │ Service Consumer│
│   (Node.js)     │  Push   │ Pub/Sub │  Listen │   (Node.js)     │
│   Console       │ Message │ Channel │ Message │   Console       │
└─────────────────┘         └─────────┘         └─────────────────┘
```

1. **Service Producer** nhận input từ console
2. **Service Producer** publish tin nhắn vào Redis channel `chat:messages`
3. **Service Consumer** subscribe Redis channel và nhận tin nhắn
4. **Service Consumer** hiển thị tin nhắn trên console

## Cấu trúc Project

```
MessageQueue/
├── service-producer/
│   ├── index.js              # Main file - Console input
│   └── package.json
│
└── service-consumer/
    ├── index.js              # Main file - Console output
    └── package.json
```

## Tính năng

- ✅ Chat qua console đơn giản
- ✅ Gửi tin nhắn real-time qua Redis Pub/Sub
- ✅ Hiển thị tin nhắn trên console
- ✅ Hỗ trợ nhiều người dùng (chạy nhiều Service Producer)
- ✅ Sử dụng Node.js ES modules
- ✅ Xử lý lỗi và graceful shutdown

## Lưu ý

- Đảm bảo Redis đang chạy trước khi khởi động các services
- Service Consumer phải được khởi động trước Service Producer để có thể nhận tin nhắn ngay lập tức
- Có thể chạy nhiều Service Producer để mô phỏng nhiều người chat
- Redis channel sử dụng: `chat:messages`
- Gõ `exit` trong Service Producer để thoát
- Nhấn `Ctrl+C` trong Service Consumer để dừng

## Troubleshooting

**Lỗi kết nối Redis:**
- Kiểm tra Redis có đang chạy không: `redis-cli ping`
- Kiểm tra host và port trong code (mặc định: localhost:6379)

**Lỗi module không tìm thấy:**
- Chạy `npm install` trong cả 2 thư mục service-producer và service-consumer
