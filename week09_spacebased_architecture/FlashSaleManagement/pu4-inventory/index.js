const express = require('express');
const { connectRedis, client } = require('../shared/redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8084;

// API: Lấy tồn kho
app.get('/stock/:productId', async (req, res) => {
    try {
        await connectRedis();
        const stock = await client.get(`stock:${req.params.productId}`);
        res.json({ productId: req.params.productId, stock: parseInt(stock) || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Giảm tồn kho (Atomic)
app.post('/inventory/decrease', async (req, res) => {
    const { productId, qty } = req.body;
    try {
        await connectRedis();
        
        // Sử dụng cơ chế Atomic của Redis để tránh tranh chấp (Race Condition)
        const currentStock = await client.get(`stock:${productId}`);
        if (parseInt(currentStock) < qty) {
            return res.status(400).json({ message: 'Không đủ hàng' });
        }

        const newStock = await client.decrBy(`stock:${productId}`, qty);
        console.log(`📉 Giảm kho ${productId}: còn ${newStock}`);
        
        res.json({ message: 'Giảm kho thành công', newStock });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 PU4 - Inventory Service đang chạy tại cổng ${PORT}`);
});
