const express = require('express');
const cors = require('cors');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8084;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380';

const client = redis.createClient({ url: REDIS_URL });
async function connectRedis() {
    if (!client.isOpen) await client.connect();
    return client;
}

app.get('/stock/:productId', async (req, res) => {
    try {
        const redisClient = await connectRedis();
        const stock = await redisClient.get(`stock:${req.params.productId}`);
        res.json({ stock: parseInt(stock) || 0 });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi lấy tồn kho' });
    }
});

app.post('/inventory/decrease', async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const redisClient = await connectRedis();
        const stock = await redisClient.get(`stock:${productId}`);
        if (parseInt(stock) < quantity) return res.status(400).json({ message: 'Hết hàng' });

        const newStock = await redisClient.decrBy(`stock:${productId}`, quantity);
        if (newStock < 0) {
            await redisClient.incrBy(`stock:${productId}`, quantity);
            return res.status(400).json({ message: 'Hết hàng' });
        }
        res.json({ message: 'Đã trừ tồn kho', newStock });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi xử lý tồn kho' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Inventory Service đang chạy trên cổng ${PORT}`);
});
