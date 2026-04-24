const axios = require('axios');

async function runBenchmark() {
    const baseUrl = 'http://localhost:3000';
    const TOTAL_REQUESTS = 10000; // Tăng lên 10.000 request
    const CONCURRENCY = 100;    // Tăng lên 100 requests song song

    console.log('🚀 Bắt đầu Benchmark Đọc từ Data Grid (Redis)...');

    // 1. Tạo một đơn hàng mẫu trước
    const orderRes = await axios.post(`${baseUrl}/orders`, {
        customerName: 'Benchmark User',
        totalAmount: 100,
        items: [{ name: 'Test Item', price: 100, qty: 1 }]
    });
    const orderId = orderRes.data.orderId;

    // Đợi 2 giây để chắc chắn Write Service đã đẩy dữ liệu lên Redis
    await new Promise(r => setTimeout(r, 2000));

    console.log(`📦 Đã tạo đơn hàng: ${orderId}`);
    console.log(`🔥 Đang thực hiện ${TOTAL_REQUESTS} requests với độ ưu tiên song song: ${CONCURRENCY}...`);

    const startTime = Date.now();
    let completed = 0;

    // Hàm gửi request
    const sendRequest = async () => {
        try {
            await axios.get(`${baseUrl}/orders/${orderId}`);
            completed++;
            if (completed % 100 === 0) {
                process.stdout.write(`.`);
            }
        } catch (err) {
            console.error('Lỗi request:', err.message);
        }
    };

    // Chạy song song theo nhóm (Concurrency control)
    const tasks = [];
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        tasks.push(sendRequest());
        if (tasks.length >= CONCURRENCY) {
            await Promise.all(tasks);
            tasks.length = 0;
        }
    }
    await Promise.all(tasks);

    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;
    const rps = (TOTAL_REQUESTS / durationSeconds).toFixed(2);

    console.log('\n\n--- KẾT QUẢ BENCHMARK ---');
    console.log(`✅ Hoàn thành: ${TOTAL_REQUESTS} requests`);
    console.log(`⏱️ Tổng thời gian: ${durationSeconds} giây`);
    console.log(`⚡ Tốc độ xử lý: ${rps} requests/giây (RPS)`);
    console.log('-------------------------');
    console.log('Lưu ý: Tốc độ thực tế phụ thuộc vào CPU và Network của máy bạn.');
}

runBenchmark().catch(err => console.error(err));
