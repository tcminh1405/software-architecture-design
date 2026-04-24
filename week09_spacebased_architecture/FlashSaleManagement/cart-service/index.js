const express = require('express');
const cors = require('cors');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8082;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380';

const client = redis.createClient({ url: REDIS_URL });
async function connectRedis() {
    if (!client.isOpen) await client.connect();
    return client;
}

app.post('/cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const redisClient = await connectRedis();
        await redisClient.hSet(`cart:${userId}`, productId, quantity);
        res.json({ message: 'Đã cập nhật giỏ hàng' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi cập nhật giỏ hàng' });
    }
});

app.get('/cart/:userId', async (req, res) => {
    try {
        const redisClient = await connectRedis();
        const cart = await redisClient.hGetAll(`cart:${req.params.userId}`);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi lấy giỏ hàng' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Cart Service đang chạy trên cổng ${PORT}`);
});
