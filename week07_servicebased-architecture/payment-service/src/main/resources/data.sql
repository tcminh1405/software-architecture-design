-- ============================================================
-- SỬ DỤNG LỆNH MERGE CỦA H2 ĐỂ ĐẢM BẢO KHÔNG BỊ TRÙNG LẶP KHI RESTART
-- ============================================================

-- 1. Thêm 6 người dùng
MERGE INTO users (id, username, password, role) KEY(id) VALUES 
(1, 'admin', 'admin123', 'ADMIN'),
(2, 'user1', 'user123', 'USER'),
(3, 'user2', 'user123', 'USER'),
(4, 'user3', 'user123', 'USER'),
(5, 'nguyenvana', 'pass123', 'USER'),
(6, 'tranthib', 'pass123', 'USER');

-- 2. Thêm 10 món ăn đa dạng
MERGE INTO foods (id, name, description, price, image_url) KEY(id) VALUES 
(1, 'Phở Bò Viên', 'Phở bò đặc biệt nhiều thịt', 55000, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'),
(2, 'Bún Chả Hà Nội', 'Bún chả nướng than hoa', 45000, 'https://images.unsplash.com/photo-1562967914-608f82629710'),
(3, 'Bánh Mì Thịt Nướng', 'Bánh mì giòn rụm', 25000, 'https://images.unsplash.com/photo-1509722747041-619f3830c6a3'),
(4, 'Cà Phê Sữa Đá', 'Cà phê phin Sài Gòn', 20000, 'https://images.unsplash.com/photo-1541167760496-162955ed2a95'),
(5, 'Cơm Tấm Sườn Bì', 'Sườn nướng mỡ hành', 60000, 'https://images.unsplash.com/photo-1626804475297-41609ea0dc4f'),
(6, 'Trà Sữa Trân Châu', 'Trà sữa đường đen', 35000, 'https://images.unsplash.com/photo-1558855567-1faabf66c4c5'),
(7, 'Gà Rán (Phần 2 miếng)', 'Gà rán giòn cay', 70000, 'https://images.unsplash.com/photo-1562967915-92ae0c242519'),
(8, 'Pizza Hải Sản', 'Pizza size vừa', 120000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'),
(9, 'Mì Cay 7 Cấp Độ', 'Mì kim chi hải sản chua cay', 50000, 'https://images.unsplash.com/photo-1552611052-33e04de081de'),
(10, 'Gỏi Cuốn Tôm Thịt', 'Gỏi cuốn chấm tương đen (3 cuốn)', 30000, 'https://images.unsplash.com/photo-1634594191395-5d4de7ecebb7');

-- 3. Tạo 8 đơn hàng đa dạng trạng thái
MERGE INTO orders (id, user_id, status, total_price, payment_method) KEY(id) VALUES 
(1, 2, 'DELIVERED', 110000, 'ZALOPAY'),
(2, 2, 'PAID', 65000, 'MOMO'),
(3, 3, 'PENDING', 120000, 'CASH'),
(4, 4, 'CANCELLED', 55000, 'VNPAY'),
(5, 5, 'DELIVERED', 165000, 'CREDIT_CARD'),
(6, 6, 'PAID', 70000, 'MOMO'),
(7, 2, 'PENDING', 35000, 'CASH'),
(8, 3, 'PAID', 50000, 'VNPAY');

-- 4. Tạo chi tiết món cho các đơn hàng (Order Items)
MERGE INTO order_items (id, order_id, food_id, quantity, price) KEY(id) VALUES 
(1, 1, 1, 2, 55000),          -- Đơn 1: 2 Phở Bò
(2, 2, 2, 1, 45000),          -- Đơn 2: 1 Bún Chả 
(3, 2, 4, 1, 20000),          -- Đơn 2: 1 Cà Phê
(4, 3, 8, 1, 120000),         -- Đơn 3: 1 Pizza
(5, 4, 1, 1, 55000),          -- Đơn 4: 1 Phở Bò (Hủy)
(6, 5, 5, 2, 60000),          -- Đơn 5: 2 Cơm Tấm
(7, 5, 2, 1, 45000),          -- Đơn 5: 1 Bún Chả
(8, 6, 7, 1, 70000),          -- Đơn 6: 1 Gà Rán
(9, 7, 6, 1, 35000),          -- Đơn 7: 1 Trà Sữa
(10, 8, 9, 1, 50000);         -- Đơn 8: 1 Mì Cay

-- 5. Lịch sử thanh toán cho những đơn (Đơn 1, 2, 4, 5, 6, 8)
MERGE INTO payments (id, order_id, username, amount, payment_method, status) KEY(id) VALUES 
(1, 1, 'user1', 110000, 'ZALOPAY', 'SUCCESS'),
(2, 2, 'user1', 65000, 'MOMO', 'SUCCESS'),
(3, 4, 'user3', 55000, 'VNPAY', 'REFUNDED'),
(4, 5, 'nguyenvana', 165000, 'CREDIT_CARD', 'SUCCESS'),
(5, 6, 'tranthib', 70000, 'MOMO', 'SUCCESS'),
(6, 8, 'user2', 50000, 'VNPAY', 'SUCCESS');
