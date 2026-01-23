# Hướng dẫn Kiểm thử Chương trình

Tài liệu này hướng dẫn bạn thực hiện 2 loại kiểm thử chính:
1.  **Performance Test**: Kiểm tra tốc độ phản hồi của một request đơn lẻ (Latency).
2.  **Scalability Test**: Kiểm tra khả năng chịu tải của hệ thống khi có nhiều người dùng cùng lúc (Throughput).

---

## Chuẩn bị Môi trường

1.  **Bật Docker**: Đảm bảo Docker Desktop đang chạy.
2.  **Bật Redis**:
    ```bash
    docker-compose up -d
    ```
3.  **Chạy Ứng dụng**:
    ```bash
    .\mvnw spring-boot:run
    ```

---

## Phần 1: Kiểm thử Hiệu năng Đơn lẻ (Latency)
*Mục tiêu minh chứng tham số **Time** (ms) giảm đáng kể.*

### Kịch bản 1: Không có Cache (Cache Miss)
Khi bạn gọi một sản phẩm **lần đầu tiên**, dữ liệu chưa có trong Redis, hệ thống phải xử lý chậm (giả lập 2s).

1.  Mở Postman.
2.  Tạo request `GET http://localhost:8080/api/v1/products/100` (dùng ID mới để chắc chắn chưa cache).
3.  Nhấn **Send**.
4.  **Quan sát**:
    *   **Time**: ~2000ms (2 giây).
    *   **Kết luận**: Xử lý chậm do vào DB.
5.  *Chụp màn hình kết quả này.*

### Kịch bản 2: Có Cache (Cache Hit)
Khi bạn gọi **lại đúng sản phẩm đó**, dữ liệu đã có trong Redis.

1.  Vẫn request `GET http://localhost:8080/api/v1/products/100`.
2.  Nhấn **Send**.
3.  **Quan sát**:
    *   **Time**: < 50ms (rất nhanh).
    *   **Kết luận**: Dữ liệu lấy từ Redis, không bị delay.
4.  *Chụp màn hình kết quả này để so sánh với Kịch bản 1.*

---

## Phần 2: Kiểm thử Khả năng Chịu tải (Scalability)
*Mục tiêu minh chứng tham số **Throughput** (Requests/s) tăng cao.*

Chúng ta sẽ dùng tính năng **Performance** của Postman để giả lập 50 người dùng cùng tấn công (spam) vào server.

### Bước 1: Cấu hình
1.  Trong Postman, tạo một **Collection** mới (ví dụ tên "Test Scalability").
2.  Lưu request `GET http://localhost:8080/api/v1/products/1` vào Collection này.
3.  Bấm vào tên Collection -> chọn tab **Runs** (hoặc nút Run).
4.  Chọn chế độ **Performance**.

### Bước 2: Chạy Test
1.  Thiết lập thông số:
    *   **Virtual Users**: 50 (Giả lập 50 người).
    *   **Duration**: 1 phút.
2.  Bấm **Run**.

### Bước 3: Đọc Kết quả
Vì chúng ta đã có Redis (cho ID 1), hệ thống sẽ trả lời cực nhanh.

*   **Quan sát biểu đồ**:
    *   **Throughput (Req/s)**: Sẽ rất cao (có thể lên tới hàng trăm hoặc nghìn req/s).
    *   **Avg Response Time**: Rất thấp.
*   **Ý nghĩa**: Nhờ Redis, server không bị "treo" ở hàm `sleep(2000)`, nên nso có thể xử lý đồng thời hàng nghìn yêu cầu. Đây chính là tính **Scalability**.

### (Tham khảo) Nếu không có Redis thì sao?
Để tắt Redis, mở file ProductService.java Comment (ẩn) dòng @Cacheable... lại.
Nếu bạn tắt Redis hoặc test với code cũ:
*   **Throughput** sẽ cực thấp (chỉ khoảng ~20-25 req/s với 50 users).
*   Lý do: Các luồng (Threads) của Server bị kẹt chờ 2s, không thể nhận thêm khách mới.
