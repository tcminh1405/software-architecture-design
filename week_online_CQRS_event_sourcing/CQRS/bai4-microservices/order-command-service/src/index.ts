// src/index.ts
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 4001;
const QUERY_SERVICE_URL = 'http://localhost:4002/internal/events';

app.use(express.json());

// Write Store (Command Side)
const orders: any[] = [];

/**
 * 1. Book Order (Command)
 * Logic: Save to DB + Emit Event to Query Service
 */
app.post('/orders', async (req, res) => {
    const { customerName, product, amount } = req.body;
    
    // Tạo order
    const order = {
        id: uuidv4(),
        customerName,
        product,
        amount,
        status: 'created',
        createdAt: new Date()
    };
    
    // 1. Ghi vào Write-Store cá nhân
    orders.push(order);
    console.log(`[Command] Order saved: ${order.id}`);

    // 2. Phát sự kiện sang Query-Service (Giả lập Broker)
    try {
        await axios.post(QUERY_SERVICE_URL, {
            type: 'OrderCreated',
            payload: order
        });
        console.log(`[Command] Event OrderCreated emitted for ${order.id}`);
    } catch (err) {
        console.error(`[Command] Failed to emit event to Query Service. Is it running?`);
    }

    res.status(201).json({ success: true, message: 'Đã nhận lệnh đặt hàng', orderId: order.id });
});

app.get('/', (req, res) => {
    res.json({ service: 'Order Command Service', port: PORT, write_store_count: orders.length });
});

app.listen(PORT, () => {
    console.log(`🚀 COMMAND SERVICE (Port ${PORT}) is running...`);
});
