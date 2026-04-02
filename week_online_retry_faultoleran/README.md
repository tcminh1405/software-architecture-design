# Fault Tolerance Demo - Node.js

Demo các patterns Fault Tolerance (tương tự Resilience4J trong Java) sử dụng Node.js.

## Kiến trúc

```
┌─────────────┐      Retry, Circuit Breaker,      ┌─────────────┐
│  Service A  │  ─────────────────────────────►   │  Service B  │
│  (Port 3000)│      Rate Limiter, Bulkhead       │  (Port 4000)│
└─────────────┘                                   └─────────────┘
```

## Các Pattern được triển khai

### 1. Retry Pattern (Thử lại)
- **Mô tả**: Tự động thử lại request khi thất bại
- **Cấu hình**:
  - Số lần thử tối đa: 3
  - Backoff: Exponential (1s → 2s → 4s)
- **File**: `service-a/patterns/retry.js`

### 2. Circuit Breaker (Cầu dao)
- **Mô tả**: Ngắt mạch khi phát hiện nhiều lỗi liên tiếp
- **Trạng thái**:
  - CLOSED (Đóng): Hoạt động bình thường
  - OPEN (Mở): Từ chối tất cả request
  - HALF_OPEN (Nửa mở): Cho phép thử nghiệm
- **Cấu hình**:
  - Ngưỡng lỗi: 50%
  - Thời gian reset: 10 giây
- **File**: `service-a/patterns/circuitBreaker.js`

### 3. Rate Limiter (Giới hạn tốc độ)
- **Mô tả**: Giới hạn số request trong khoảng thời gian
- **Thuật toán**: Token Bucket
- **Cấu hình**:
  - Tối đa: 5 request/giây
  - Queue: 10 request
- **File**: `service-a/patterns/rateLimiter.js`

### 4. Bulkhead (Vách ngăn)
- **Mô tả**: Cô lập tài nguyên, giới hạn concurrent requests
- **Cấu hình**:
  - Max concurrent: 3
  - Queue: 5 request
- **File**: `service-a/patterns/bulkhead.js`

## Cài đặt

```bash
# Cài đặt dependencies cho Service B
cd service-b
npm install

# Cài đặt dependencies cho Service A
cd ../service-a
npm install
```

## Chạy Demo

### Bước 1: Khởi động Service B
```bash
cd service-b
npm start
```

### Bước 2: Khởi động Service A (terminal mới)
```bash
cd service-a
npm start
```

### Bước 3: Test các endpoints

#### Demo Retry Pattern
```bash
curl http://localhost:3000/demo/retry
```

#### Demo Circuit Breaker
```bash
curl http://localhost:3000/demo/circuit-breaker
```

#### Demo Rate Limiter
```bash
curl http://localhost:3000/demo/rate-limiter
```

#### Demo Bulkhead
```bash
curl http://localhost:3000/demo/bulkhead
```

#### Demo tất cả patterns
```bash
curl http://localhost:3000/demo/all
```

## Service B - Các Endpoint Test

| Endpoint | Mô tả |
|----------|-------|
| `/api/data` | Trả về dữ liệu bình thường |
| `/api/slow` | Phản hồi chậm (2-5 giây) |
| `/api/flaky` | 50% thất bại ngẫu nhiên |
| `/api/fail` | Luôn trả về lỗi 500 |
| `/api/heavy` | Xử lý nặng (1-3 giây) |
| `/api/configurable?failRate=0.3` | Tỷ lệ lỗi tùy chỉnh |

## So sánh với Resilience4J (Java)

| Resilience4J | Node.js Demo |
|--------------|--------------|
| `@Retry` | `goiVoiRetry()` |
| `@CircuitBreaker` | `opossum` library |
| `@RateLimiter` | Custom Token Bucket |
| `@Bulkhead` | Custom implementation |

## Cấu trúc thư mục

```
btlt_faultoleran/
├── README.md
├── service-a/
│   ├── package.json
│   ├── index.js
│   └── patterns/
│       ├── retry.js
│       ├── circuitBreaker.js
│       ├── rateLimiter.js
│       └── bulkhead.js
└── service-b/
    ├── package.json
    └── index.js
```

## Hướng dẫn chụp minh chứng bằng Postman

### Chuẩn bị
1. Mở 2 terminal:
   - Terminal 1: `cd service-b && npm start` (port 4000)
   - Terminal 2: `cd service-a && npm start` (port 3000)
2. Mở Postman

---

### 1. Minh chứng Retry Pattern

**Bước 1**: Trong Postman, tạo request mới:
- Method: `GET`
- URL: `http://localhost:3000/demo/retry`
- Click **Send**

**Bước 2**: Chụp màn hình Postman, cần thấy:
- Status: `200 OK`
- Response body chứa:
  ```json
  {
    "pattern": "RETRY",
    "ketQua": {
      "lanThu": 2,
      "tongSoLanThu": 3
    }
  }
  ```

**Bước 3**: Chụp terminal Service A thấy log:
```
🔄 [RETRY] Lần thử 1/3...
⚠️ [RETRY] Thất bại, chờ 1000ms trước khi thử lại...
🔄 [RETRY] Lần thử 2/3...
✅ [RETRY] Thành công ở lần thử 2
```

---

### 2. Minh chứng Circuit Breaker

**Bước 1**: Trong Postman:
- Method: `GET`
- URL: `http://localhost:3000/demo/circuit-breaker`
- Click **Send**

**Bước 2**: Chụp màn hình Postman, cần thấy:
- Status: `200 OK`
- Response chứa `"trangThaiCircuit": "MỞ"` và các request bị từ chối

**Bước 3**: Chụp terminal Service A thấy log:
```
 [CB] Circuit OPENED - Mạch đã ngắt!
⛔ [CB] Request bị TỪ CHỐI - Circuit đang mở!
```

---

### 3. Minh chứng Rate Limiter

**Bước 1**: Trong Postman:
- Method: `GET`
- URL: `http://localhost:3000/demo/rate-limiter`
- Click **Send**

**Bước 2**: Chụp màn hình Postman, cần thấy:
- Response có `thongKe` với:
  - `"chapNhan": 5` (được chấp nhận)
  - `"tuChoi": ...` (bị từ chối)

**Bước 3**: Chụp terminal Service A thấy log:
```
✅ [RATE LIMITER] Request được CHẤP NHẬN
⛔ [RATE LIMITER] Request bị TỪ CHỐI - Vượt quá giới hạn!
```

---

### 4. Minh chứng Bulkhead

**Bước 1**: Trong Postman:
- Method: `GET`
- URL: `http://localhost:3000/demo/bulkhead`
- Click **Send**

**Bước 2**: Chụp màn hình Postman, cần thấy:
- Response có `thongKe` với:
  - `"concurrentCaoNhat": 3`
  - `"tuChoi": 2`

**Bước 3**: Chụp terminal Service A thấy log:
```
🔄 [BULKHEAD] Đang xử lý (3/3 concurrent)
⛔ [BULKHEAD] Request bị TỪ CHỐI - Bulkhead đầy!
```

---

### Tóm tắt các URL trong Postman

| STT | Pattern | Method | URL |
|-----|---------|--------|-----|
| 1 | Retry | GET | `http://localhost:3000/demo/retry` |
| 2 | Circuit Breaker | GET | `http://localhost:3000/demo/circuit-breaker` |
| 3 | Rate Limiter | GET | `http://localhost:3000/demo/rate-limiter` |
| 4 | Bulkhead | GET | `http://localhost:3000/demo/bulkhead` |

### Checklist minh chứng

- [ ] Ảnh 1: Postman - Retry Pattern (thấy `lanThu`, `tongSoLanThu`)
- [ ] Ảnh 2: Terminal - Retry logs
- [ ] Ảnh 3: Postman - Circuit Breaker (thấy `trangThaiCircuit: "MỞ"`)
- [ ] Ảnh 4: Terminal - Circuit Breaker logs
- [ ] Ảnh 5: Postman - Rate Limiter (thấy `chapNhan`, `tuChoi`)
- [ ] Ảnh 6: Terminal - Rate Limiter logs
- [ ] Ảnh 7: Postman - Bulkhead (thấy `concurrentCaoNhat: 3`)
- [ ] Ảnh 8: Terminal - Bulkhead logs
