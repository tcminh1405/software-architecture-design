// src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.static(path.join(process.cwd(), 'public')));
const PORT = 4002;

app.use(express.json());

// Read Store (Query Side)
// Tối ưu hóa cho truy vấn, có thể lưu vào Elasticsearch/Redis trong thực tế
const readStore: any[] = [];

/**
 * 1. Internal Event Listener (Consumer)
 * Lắng nghe sự kiện từ Command Service (hoặc Broker)
 */
app.post('/internal/events', (req, res) => {
    const { type, payload } = req.body;
    
    if (type === 'OrderCreated') {
        // Đồng bộ dữ liệu sang Read Store
        // Ở đây ta có thể tính toán thêm (denormalization)
        const view = {
            ...payload,
            summary: `${payload.customerName} đặt ${payload.product} (${payload.amount} VNĐ)`,
            syncedAt: new Date()
        };
        readStore.push(view);
        console.log(`[Query] Synced new order to Read Store: ${payload.id}`);
    }
    
    res.json({ success: true });
});

/**
 * 2. Get All Orders (Query)
 * Lấy dữ liệu từ Read Store tốc độ cao
 */
app.get('/orders', (req, res) => {
    res.json({ success: true, count: readStore.length, data: readStore });
});

app.get('/', (req, res) => {
    res.json({ service: 'Order Query Service', port: PORT, read_store_count: readStore.length });
});

app.listen(PORT, () => {
    console.log(`🚀 QUERY SERVICE (Port ${PORT}) is running...`);
});
