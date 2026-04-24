const express = require('express');
const { connectRedis, client } = require('../shared/redis');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 8081;

// API: Xem danh sách sản phẩm
app.get('/products', async (req, res) => {
    try {
        await connectRedis();
        const productsData = await client.hGetAll('products');
        const products = Object.values(productsData).map(p => JSON.parse(p));
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Xem chi tiết sản phẩm
app.get('/products/:id', async (req, res) => {
    try {
        await connectRedis();
        const product = await client.hGet('products', req.params.id);
        if (product) {
            res.json(JSON.parse(product));
        } else {
            res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 PU1 - Product Service đang chạy tại cổng ${PORT}`);
});
