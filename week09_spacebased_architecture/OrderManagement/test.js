const axios = require('axios');

async function demo() {
    const baseUrl = 'http://localhost:3000';
    
    console.log('--- 1. Tạo Đơn hàng mới (POST) ---');
    const orderData = {
        customerName: 'Nguyễn Văn A',
        totalAmount: 1500000,
        items: [
            { name: 'Bàn phím cơ', price: 1000000, qty: 1 },
            { name: 'Chuột không dây', price: 500000, qty: 1 }
        ]
    };

    const writeRes = await axios.post(`${baseUrl}/orders`, orderData);
    const id = writeRes.data.orderId;
    console.log('API Phản hồi:', writeRes.data);

    console.log('\n--- 2. Chờ hệ thống xử lý đơn hàng... (3 giây) ---');
    await new Promise(r => setTimeout(r, 3000));

    console.log('\n--- 3. Kiểm tra Trạng thái Đơn hàng (GET) ---');
    const readRes = await axios.get(`${baseUrl}/orders/${id}`);
    console.log('Thông tin Đơn hàng:', readRes.data);

    console.log('\n--- 4. Truy vấn lại (Kiểm tra Cache Hit từ Redis) ---');
    const readRes2 = await axios.get(`${baseUrl}/orders/${id}`);
    console.log('Thông tin Đơn hàng (Lấy từ Cache):', readRes2.data);
}

demo().catch(err => console.error('Lỗi:', err.message));
