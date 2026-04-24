require('dotenv').config();
const { connectRedis, client } = require('../shared/redis');

async function seed() {
    await connectRedis();
    console.log('🧹 Đang làm sạch Data Grid...');
    await client.flushAll();

    const products = [
        { id: '1', name: 'iPhone 15 Pro Max', price: 29000000, description: 'Săn ngay kẻo hết!' },
        { id: '2', name: 'MacBook M3 Air', price: 25000000, description: 'Hàng chính hãng VN/A' },
        { id: '3', name: 'Sony WH-1000XM5', price: 7000000, description: 'Chống ồn đỉnh cao' },
        { id: '4', name: 'iPad Pro M4', price: 22000000, description: 'Màn hình OLED 120Hz' },
        { id: '5', name: 'Apple Watch Ultra 2', price: 18000000, description: 'Bền bỉ mọi cung đường' }
    ];

    console.log('📦 Đang nạp sản phẩm và tồn kho vào Data Grid...');
    for (const p of products) {
        await client.hSet('products', p.id, JSON.stringify(p));
        await client.set(`stock:${p.id}`, 50); // Mỗi món có 50 cái
    }

    console.log('✅ Đã nạp xong dữ liệu Flash Sale!');
    process.exit(0);
}

seed().catch(err => console.error(err));
