require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { publishToQueue } = require('../shared/rabbitmq');
const { connectRedis, client: redisClient } = require('../shared/redis');
const { pool } = require('../shared/db');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// LUỒNG GHI: Tạo Đơn hàng mới (CQRS Command)
app.post('/orders', async (req, res) => {
    const { customerName, totalAmount, items } = req.body;
    const order = { 
        id: uuidv4(), 
        customerName, 
        totalAmount, 
        items, 
        status: 'PENDING',
        createdAt: new Date() 
    };
    
    try {
        // Đẩy vào hàng đợi để xử lý thanh toán/kho bãi sau
        await publishToQueue('order-write-mq', order);
        res.status(202).json({ 
            message: 'Đơn hàng đang được xử lý', 
            orderId: order.id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LUỒNG ĐỌC: Truy vấn Trạng thái Đơn hàng (Data Grid - Redis)
app.get('/orders/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const redis = await connectRedis();
        
        // 1. Kiểm tra trong Lưới dữ liệu (Redis) để phản hồi nhanh 100k r/s
        const cachedOrder = await redis.get(`order:${id}`);
        if (cachedOrder) {
            console.log('🚀 Cache Hit! Trả về đơn hàng từ Redis.');
            return res.json(JSON.parse(cachedOrder));
        }

        // 2. Nếu không có trong Cache, truy vấn DB (Processing Unit logic)
        console.log('🐢 Cache Miss. Đang truy vấn Database...');
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        
        if (result.rows.length > 0) {
            const order = result.rows[0];
            // Đồng bộ lại vào Redis để lần sau đọc nhanh hơn
            await redis.setEx(`order:${id}`, 3600, JSON.stringify(order));
            return res.json(order);
        }

        res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, async () => {
    await connectRedis();
    console.log(`🚀 Hệ thống Quản lý Đơn hàng (API Gateway) đang chạy tại cổng ${PORT}`);
});
