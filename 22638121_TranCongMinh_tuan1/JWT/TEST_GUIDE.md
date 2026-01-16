# Hướng dẫn Test JWT Authentication (HS256)

## Bước 1: Khởi động ứng dụng

```bash
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại `http://localhost:8080`

## Bước 2: Đăng nhập để lấy tokens

### Sử dụng cURL:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Response mẫu:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIiwiUk9MRV9VU0VSIl0sInR5cCI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzA5ODc2NTQzLCJleHAiOjE3MDk4Nzc0NDN9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJyZWZyZXNoIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MDk4NzY1NDMsImV4cCI6MTcxMDQ4MTM0M30...",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

### Lưu token vào biến (PowerShell):

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'
$accessToken = $response.accessToken
$refreshToken = $response.refreshToken
```

## Bước 3: Sử dụng Access Token để truy cập protected resources

### Public Resource (không cần token):

```bash
curl http://localhost:8080/api/resources/public
```

### Protected Resource (cần token):

```bash
curl -X GET http://localhost:8080/api/resources/protected \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Admin Resource (cần ADMIN role):

```bash
curl -X GET http://localhost:8080/api/resources/admin \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### User Resource (cần USER role):

```bash
curl -X GET http://localhost:8080/api/resources/user \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Bước 4: Refresh Access Token

Khi Access Token hết hạn (sau 15 phút), sử dụng Refresh Token để lấy Access Token mới:

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<REFRESH_TOKEN>"
  }'
```

## Bước 5: Validate Token

Kiểm tra token có hợp lệ không:

```bash
curl -X POST http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Test với Postman

1. **Tạo Collection mới**
2. **Tạo request "Login"**:
   - Method: POST
   - URL: `http://localhost:8080/api/auth/login`
   - Body (raw JSON):
     ```json
     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - Tests tab: Lưu tokens vào variables
     ```javascript
     var jsonData = pm.response.json();
     pm.environment.set("accessToken", jsonData.accessToken);
     pm.environment.set("refreshToken", jsonData.refreshToken);
     ```

3. **Tạo request "Get Protected Resource"**:
   - Method: GET
   - URL: `http://localhost:8080/api/resources/protected`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer {{accessToken}}`

4. **Tạo request "Refresh Token"**:
   - Method: POST
   - URL: `http://localhost:8080/api/auth/refresh`
   - Body (raw JSON):
     ```json
     {
       "refreshToken": "{{refreshToken}}"
     }
     ```

## Decode JWT Token

Để xem nội dung của JWT token, truy cập: https://jwt.io/

1. Paste token vào phần "Encoded"
2. Xem các claims trong phần "Decoded"
3. **Lưu ý**: Với HS256, bạn cần nhập secret key (`mySecretKey123456789012345678901234567890`) vào phần "Verify Signature" để verify token

## Users mẫu

| Username | Password | Roles      | Có thể truy cập |
|----------|----------|------------|-----------------|
| admin    | admin123 | ADMIN, USER| Tất cả resources|
| user     | admin123 | USER       | /protected, /user|

## Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra token có đúng format không (Bearer <token>)
- Kiểm tra token chưa hết hạn
- Kiểm tra secret key trong `application.properties` đúng
- Kiểm tra token được sign bằng đúng secret key

### Lỗi 403 Forbidden
- Kiểm tra user có đủ quyền (roles) không
- Admin resource cần ROLE_ADMIN
- User resource cần ROLE_USER

### Token hết hạn
- Access Token hết hạn sau 15 phút
- Sử dụng Refresh Token để lấy Access Token mới
- Refresh Token hết hạn sau 7 ngày

### Secret Key không khớp
- Đảm bảo secret key trong `application.properties` giống nhau
- Nếu thay đổi secret key, tất cả tokens cũ sẽ không còn hợp lệ

## So sánh HS256 vs RSA

| Tiêu chí | HS256 | RSA |
|----------|-------|-----|
| Độ phức tạp | Đơn giản | Phức tạp hơn |
| Key | 1 secret key | 1 key pair (public/private) |
| Hiệu suất | Nhanh hơn | Chậm hơn |
| Phù hợp | Single server | Multi-server, microservices |
| Học tập | Dễ học | Khó học hơn |

Dự án này sử dụng **HS256** vì đơn giản, dễ học và phù hợp cho báo cáo.
