# Database Partitioning Demo

## Chạy toàn bộ bằng Docker (1 lệnh duy nhất)

```bash
docker compose up --build
```

Docker sẽ tự động:
1. Khởi động SQL Server 2022
2. Chờ SQL Server sẵn sàng (healthcheck)
3. Chạy lần lượt 3 script SQL
4. Khởi động Node.js app

## Test API sau khi containers chạy xong

### 1. Horizontal Partitioning (Nam -> table_user_01 / Nữ -> table_user_02)
```bash
# Insert user Nam
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"Nguyen Van A\",\"gender\":\"Nam\",\"email\":\"a@test.com\",\"age\":25}"

# Insert user Nu
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"Tran Thi B\",\"gender\":\"Nu\",\"email\":\"b@test.com\",\"age\":23}"

# Query chi partition Nam
curl http://localhost:3000/users/Nam
```

### 2. Vertical Partitioning
```bash
# Chi load cot co ban (khong load Avatar/Bio)
curl http://localhost:3000/profiles/basic

# Load day du khi can (JOIN 2 bang)
curl http://localhost:3000/profiles/full/1
```

### 3. Functional Partitioning
```bash
# Tao don hang moi
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d "{\"customerID\":101,\"amount\":350000}"

# Archive don hang Completed/Cancelled sang History
curl -X POST http://localhost:3000/orders/archive
```

## Dừng và xóa containers
```bash
docker compose down -v
```

---
**Lưu ý**: Đảm bảo bạn đã cài đặt Docker Desktop và nó đang chạy trước khi thực hiện các lệnh trên. Dữ liệu sẽ được tự động khởi tạo ngay khi container SQL Server sẵn sàng.