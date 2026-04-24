const express = require('express');
const axios = require('axios');
const cors = require('cors');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8083;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:8084';

const client = redis.createClient({ url: REDIS_URL });
async function connectRedis() {
    if (!client.isOpen) await client.connect();
    return client;
}

app.post('/checkout', async (req, res) => {
    const { userId } = req.body;
    try {
        const redisClient = await connectRedis();
        const cart = await redisClient.hGetAll(`cart:${userId}`);
        if (Object.keys(cart).length === 0) return res.status(400).json({ message: 'Giỏ hàng trống' });

        for (const [productId, qty] of Object.entries(cart)) {
            const invResponse = await axios.post(`${INVENTORY_SERVICE_URL}/inventory/decrease`, {
                productId,
                quantity: parseInt(qty)
            });
            if (invResponse.status !== 200) throw new Error(`Sản phẩm ${productId} hết hàng`);
        }

        const orderId = `ORD-${Date.now()}`;
        await redisClient.hSet(`orders:${userId}`, orderId, JSON.stringify({
            id: orderId, items: cart, createdAt: new Date()
        }));
        await redisClient.del(`cart:${userId}`);

        res.json({ message: 'Thanh toán thành công', orderId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Order Service đang chạy trên cổng ${PORT}`);
});
