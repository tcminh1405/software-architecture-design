# JWT Authentication với Spring Security

Dự án này minh họa cách triển khai JWT (JSON Web Token) authentication với Spring Security sử dụng thuật toán **HS256** với secret key (đơn giản, dễ học và báo cáo).

## 📚 Kiến thức về JWT

### JWT là gì?

**JWT (JSON Web Token)** là một chuẩn mở (RFC 7519) định nghĩa cách truyền thông tin an toàn giữa các bên dưới dạng JSON object. Token này có thể được ký số (signed) hoặc mã hóa (encrypted).

#### Cấu trúc của JWT

JWT bao gồm 3 phần được phân cách bởi dấu chấm (`.`):

```
header.payload.signature
```

1. **Header**: Chứa metadata về token (thuật toán mã hóa, loại token)
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```

2. **Payload**: Chứa các claims (thông tin về user, quyền, thời gian hết hạn)
   ```json
   {
     "sub": "username",
     "authorities": ["ROLE_USER", "ROLE_ADMIN"],
     "type": "access",
     "iat": 1234567890,
     "exp": 1234571490
   }
   ```

3. **Signature**: Chữ ký số để đảm bảo tính toàn vẹn của token
   ```
   HMACSHA256(
     base64UrlEncode(header) + "." + base64UrlEncode(payload),
     secret
   )
   ```

### Access Token và Refresh Token

#### Access Token

- **Định nghĩa**: Token ngắn hạn được sử dụng để truy cập các tài nguyên được bảo vệ
- **Thời gian sống**: Ngắn (15 phút trong dự án này)
- **Mục đích**: 
  - Xác thực người dùng khi gọi API
  - Chứa thông tin về user và quyền truy cập
  - Được gửi trong header `Authorization: Bearer <token>`
- **Ưu điểm**: 
  - Giảm thiểu rủi ro nếu bị đánh cắp (thời gian sống ngắn)
  - Giảm tải cho server (không cần kiểm tra database mỗi request)

#### Refresh Token

- **Định nghĩa**: Token dài hạn được sử dụng để lấy Access Token mới
- **Thời gian sống**: Dài (7 ngày trong dự án này)
- **Mục đích**:
  - Lấy Access Token mới khi Access Token hết hạn
  - Tránh phải đăng nhập lại nhiều lần
  - Được lưu trữ an toàn (HTTP-only cookie hoặc secure storage)
- **Ưu điểm**:
  - Cải thiện trải nghiệm người dùng
  - Có thể thu hồi (revoke) khi cần thiết
  - Giảm số lần đăng nhập

#### Luồng hoạt động

```
1. User đăng nhập → Nhận Access Token + Refresh Token
2. Sử dụng Access Token để gọi API
3. Khi Access Token hết hạn:
   - Gửi Refresh Token đến /api/auth/refresh
   - Nhận Access Token mới
4. Tiếp tục sử dụng Access Token mới
```

### Cách tạo và kiểm tra Token hợp lệ

#### Tạo Token (HS256)

1. **Tạo Header**: Chứa thuật toán HS256 và loại token
2. **Tạo Payload**: Chứa claims (subject, authorities, expiration, etc.)
3. **Tạo Signature**: 
   - Sử dụng secret key để tạo HMAC-SHA256 signature
   - Signature = HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
4. **Kết hợp**: `base64(header).base64(payload).signature`

#### Kiểm tra Token hợp lệ

1. **Kiểm tra format**: Token có đúng 3 phần không?
2. **Kiểm tra signature**: 
   - Sử dụng cùng secret key để verify signature
   - Tính lại signature và so sánh với signature trong token
3. **Kiểm tra expiration**: Token chưa hết hạn?
4. **Kiểm tra claims**: Các claims có hợp lệ không?

## 🏗️ Kiến trúc Dự án

```
src/main/java/iuh/fit/se/jwt/
├── config/
│   └── SecurityConfig.java        # Cấu hình Spring Security với JWT Filter
├── controller/
│   ├── AuthController.java        # Endpoints: login, refresh, validate
│   └── ResourceController.java    # Protected resources để test
├── dto/
│   ├── AuthRequest.java           # Request DTO cho login
│   ├── AuthResponse.java         # Response DTO chứa tokens
│   └── RefreshTokenRequest.java  # Request DTO cho refresh
├── filter/
│   └── JwtAuthenticationFilter.java  # JWT Filter để validate token trong mỗi request
├── model/
│   └── User.java                 # User entity
├── service/
│   └── UserService.java          # User service (mock database)
└── util/
    └── JwtTokenProvider.java     # Utility để tạo và validate JWT (HS256)
```

## 🔐 HS256 Algorithm

Dự án sử dụng **HS256 (HMAC-SHA256)** để ký và xác minh JWT tokens:

- **Secret Key**: Dùng để ký (sign) và xác minh (verify) tokens
- **Đơn giản**: Chỉ cần một secret key, không cần key pair như RSA
- **Phù hợp**: Cho học tập và báo cáo vì dễ hiểu và triển khai

### Ưu điểm của HS256:

1. **Đơn giản**: Chỉ cần một secret key
2. **Dễ học**: Dễ hiểu và triển khai hơn RSA
3. **Hiệu suất**: Nhanh hơn RSA
4. **Phù hợp**: Cho single-server applications

### Lưu ý:

- Secret key phải được giữ bí mật
- Trong production, nên sử dụng key mạnh (ít nhất 256 bits)
- Nên lưu secret key trong environment variable, không hardcode

## 🚀 Cách chạy Dự án

### Yêu cầu

- Java 17+
- Maven 3.6+

### Cài đặt và chạy

```bash
# Build project
mvn clean install

# Chạy application
mvn spring-boot:run
```

Application sẽ chạy tại: `http://localhost:8080`

## 📡 API Endpoints

### 1. Đăng nhập (Login)

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

### 2. Refresh Token

**POST** `/api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

### 3. Validate Token

**POST** `/api/auth/validate`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "valid": true,
  "message": "Token is valid",
  "username": "admin",
  "authorities": ["ROLE_ADMIN", "ROLE_USER"]
}
```

### 4. Protected Resources

#### Public Resource
**GET** `/api/resources/public`
- Không cần authentication

#### Protected Resource
**GET** `/api/resources/protected`
- Cần Access Token hợp lệ

**Headers:**
```
Authorization: Bearer <accessToken>
```

#### Admin Resource
**GET** `/api/resources/admin`
- Cần Access Token hợp lệ
- Cần role `ROLE_ADMIN`

#### User Resource
**GET** `/api/resources/user`
- Cần Access Token hợp lệ
- Cần role `ROLE_USER`

## 🧪 Test với cURL

### 1. Đăng nhập

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Sử dụng Access Token

```bash
# Lưu token vào biến
TOKEN="<accessToken từ response trên>"

# Gọi protected resource
curl -X GET http://localhost:8080/api/resources/protected \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Refresh Token

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refreshToken từ login response>"
  }'
```

## 👤 Users mẫu

| Username | Password | Roles |
|----------|----------|-------|
| admin    | admin123 | ADMIN, USER |
| user     | admin123 | USER |

## 📝 Cấu hình

### application.properties

```properties
# JWT Secret Key
jwt.secret=mySecretKey123456789012345678901234567890
```

**Lưu ý**: Trong production, nên:
- Sử dụng secret key mạnh hơn (ít nhất 256 bits)
- Lưu trong environment variable: `jwt.secret=${JWT_SECRET}`
- Không commit secret key vào git

## 🔍 Cách hoạt động

### 1. Đăng nhập
- User gửi username/password
- Server validate credentials
- Server tạo Access Token và Refresh Token
- Server trả về tokens cho client

### 2. Gọi API với Access Token
- Client gửi request kèm `Authorization: Bearer <token>`
- `JwtAuthenticationFilter` intercept request
- Filter validate token và extract claims
- Filter set authentication vào SecurityContext
- Controller xử lý request với authentication

### 3. Refresh Token
- Client gửi Refresh Token khi Access Token hết hạn
- Server validate Refresh Token
- Server tạo Access Token mới
- Server trả về Access Token mới

## 📚 Tài liệu tham khảo

- [JWT.io](https://jwt.io/)
- [Spring Security](https://docs.spring.io/spring-security/reference/index.html)
- [RFC 7519 - JSON Web Token](https://tools.ietf.org/html/rfc7519)
- [RFC 7515 - JSON Web Signature](https://tools.ietf.org/html/rfc7515)

## 🎯 Điểm nổi bật

- ✅ **Đơn giản**: Sử dụng HS256 với secret key, dễ hiểu và học
- ✅ **Access Token + Refresh Token**: Đầy đủ flow authentication
- ✅ **Spring Security Integration**: Tích hợp với Spring Security Filter
- ✅ **Role-based Access Control**: Hỗ trợ phân quyền theo role
- ✅ **Code có comment tiếng Việt**: Dễ đọc và hiểu
