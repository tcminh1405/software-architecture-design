const express = require('express');
const cors = require('cors');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8081;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380';

const client = redis.createClient({ url: REDIS_URL });
client.on('error', (err) => console.log('❌ Redis Error:', err));

async function connectRedis() {
    if (!client.isOpen) await client.connect();
    return client;
}

app.get('/products', async (req, res) => {
    try {
        const redisClient = await connectRedis();
        const data = await redisClient.hGetAll('products');
        console.log(`🔍 Đã lấy ${Object.keys(data).length} sản phẩm từ Redis`);
        const products = Object.values(data).map(item => JSON.parse(item));
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi lấy danh sách sản phẩm' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Product Service đang chạy trên cổng ${PORT}`);
});
