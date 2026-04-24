# 🛒 Hệ thống Flash Sale - Kiến trúc Space-Based (SBA)

Dự án này mô phỏng hệ thống Flash Sale chịu tải cao, xử lý hoàn toàn trên RAM (Data Grid) để đạt độ trễ thấp nhất.

## 🚀 Hướng dẫn Triển khai nhanh (Dành cho Demo)

Bạn hãy thực hiện đúng theo 3 bước sau tại thư mục `FlashSaleManagement`:

### Bước 1: Khởi động Hạ tầng và Dịch vụ (Docker)
Đảm bảo bạn đang ở thư mục `FlashSaleManagement`. Chạy lệnh:
```bash
docker-compose up --build -d
```
*Lưu ý: Quá trình build lần đầu có thể mất vài phút vì phải cài đặt các thư viện cho 5 dịch vụ.*

### Bước 2: Nạp dữ liệu vào Data Grid (Redis)
Sau khi Docker báo các container đã "Started", hãy chạy script này để nạp sản phẩm:
```bash
node scripts/init-data.js
```
*(Nếu máy bạn báo lỗi thiếu module redis, hãy chạy `npm install redis` trước).*

### Bước 3: Truy cập và Trải nghiệm
- **Giao diện Người dùng**: Mở trình duyệt truy cập `http://localhost:3000`
- **Quản lý Redis**: Cổng `6379`
- **API Sản phẩm**: `http://localhost:8081/products`

---

## 🏗️ Cấu trúc các Processing Units (PUs)

| Dịch vụ | Cổng | Chức năng chính |
| :--- | :--- | :--- |
| **Product** | `8081` | Lấy dữ liệu sản phẩm từ Redis. |
| **Cart** | `8082` | Quản lý giỏ hàng tạm thời trên Redis. |
| **Order** | `8083` | Xử lý Checkout và điều phối đơn hàng. |
| **Inventory** | `8084` | Trừ tồn kho Atomic trên Redis (Tránh Overselling). |

## 🧪 Kịch bản Test Bắt buộc
1. **Load danh sách**: Mở web thấy sản phẩm hiện ra ngay lập tức (lấy từ Redis).
2. **Add to cart**: Thêm sản phẩm vào giỏ (lưu vào Redis).
3. **Checkout**: Nhấn thanh toán, tồn kho tại cột "Còn lại" phải giảm ngay lập tức mà không bị trễ.
4. **Hết hàng**: Thử mua hết 50 sản phẩm, hệ thống phải báo "Hết hàng" và không cho mua thêm.
