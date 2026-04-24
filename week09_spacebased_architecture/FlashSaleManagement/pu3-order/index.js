const express = require('express');
const axios = require('axios');
const { connectRedis, client } = require('../shared/redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8083;

// API: Thanh toán (Checkout)
app.post('/checkout', async (req, res) => {
    const { userId } = req.body;
    try {
        await connectRedis();
        
        // 1. Lấy giỏ hàng từ Redis
        const cart = await client.hGetAll(`cart:${userId}`);
        if (Object.keys(cart).length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }

        // 2. Gọi Inventory PU để trừ kho cho từng sản phẩm
        // Lưu ý: Trong SBA thực tế, ta có thể dùng Lua Script trên Redis để trừ kho atomic
        for (const [productId, qty] of Object.entries(cart)) {
            try {
                const invRes = await axios.post('http://localhost:8084/inventory/decrease', {
                    productId,
                    qty: parseInt(qty)
                });
                if (invRes.status !== 200) throw new Error('Hết hàng');
            } catch (err) {
                return res.status(400).json({ message: `Sản phẩm ${productId} đã hết hàng!` });
            }
        }

        // 3. Tạo đơn hàng (Lưu vào Redis)
        const orderId = `ORD-${Date.now()}`;
        await client.hSet(`orders:${userId}`, orderId, JSON.stringify({
            userId,
            items: cart,
            timestamp: new Date()
        }));

        // 4. Xóa giỏ hàng
        await client.del(`cart:${userId}`);

        res.json({ message: 'Đặt hàng thành công!', orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 PU3 - Order Service đang chạy tại cổng ${PORT}`);
});
