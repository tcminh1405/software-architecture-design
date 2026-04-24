const express = require('express');
const { connectRedis, client } = require('../shared/redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8082;

// API: Thêm vào giỏ hàng
app.post('/cart/add', async (req, res) => {
    const { userId, productId, qty } = req.body;
    try {
        await connectRedis();
        // Lưu giỏ hàng theo UserId trong Redis Hash
        await client.hSet(`cart:${userId}`, productId, qty);
        res.json({ message: 'Đã thêm vào giỏ hàng' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Xem giỏ hàng
app.get('/cart/:userId', async (req, res) => {
    try {
        await connectRedis();
        const cartData = await client.hGetAll(`cart:${req.params.userId}`);
        res.json(cartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 PU2 - Cart Service đang chạy tại cổng ${PORT}`);
});
