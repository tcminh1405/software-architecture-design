require('dotenv').config();
const { consumeQueue } = require('../shared/rabbitmq');
const { pool, initDB } = require('../shared/db');
const { connectRedis, client: redisClient } = require('../shared/redis');

async function start() {
    await initDB();
    const redis = await connectRedis();

    console.log('👷 Dịch vụ Xử lý Đơn hàng (Write Processing Unit) đã sẵn sàng...');

    // Lắng nghe các đơn hàng mới từ Messaging Grid
    await consumeQueue('order-write-mq', async (order) => {
        console.log(`📦 Đang xử lý Đơn hàng: ${order.id} cho khách hàng: ${order.customerName}`);
        
        try {
            // 1. Lưu trữ bền vững vào PostgreSQL
            await pool.query(
                'INSERT INTO orders (id, customer_name, total_amount, status, items) VALUES ($1, $2, $3, $4, $5)',
                [order.id, order.customerName, order.totalAmount, order.status, JSON.stringify(order.items)]
            );
            console.log(`✅ Đã lưu Đơn hàng ${order.id} vào Database`);

            // 2. Cập nhật Lưới dữ liệu (Redis) để Gateway có thể đọc tức thì
            await redis.setEx(`order:${order.id}`, 3600, JSON.stringify(order));
            console.log(`🔥 Đã đồng bộ Đơn hàng ${order.id} lên Data Grid (Redis)`);
            
        } catch (error) {
            console.error(`❌ Lỗi khi xử lý đơn hàng ${order.id}:`, error.message);
        }
    });
}

start();
