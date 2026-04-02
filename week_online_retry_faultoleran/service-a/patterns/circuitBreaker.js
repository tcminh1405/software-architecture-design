const axios = require('axios');
const CircuitBreaker = require('opossum');

// URL của Service B
const SERVICE_B_URL = 'http://localhost:4000';

/**
 * CIRCUIT BREAKER PATTERN - Mẫu thiết kế Cầu dao
 * 
 * Mô tả: Ngắt mạch khi phát hiện nhiều lỗi liên tiếp, tránh gọi service đang lỗi
 * 
 * Các trạng thái:
 * - CLOSED (Đóng): Hoạt động bình thường, cho phép request đi qua
 * - OPEN (Mở): Ngắt mạch, từ chối tất cả request ngay lập tức
 * - HALF_OPEN (Nửa mở): Cho phép một số request thử nghiệm
 * 
 * Cấu hình:
 * - Ngưỡng lỗi: 50%
 * - Thời gian reset: 10 giây
 * - Số request tối thiểu: 5
 */

// Cấu hình Circuit Breaker
const cauHinhCircuitBreaker = {
    timeout: 5000,              // Timeout cho mỗi request (5 giây)
    errorThresholdPercentage: 50, // Ngưỡng lỗi để mở circuit (50%)
    resetTimeout: 10000,        // Thời gian chờ trước khi thử lại (10 giây)
    volumeThreshold: 5          // Số request tối thiểu trước khi tính toán
};

// Hàm gọi Service B
async function goiServiceB(endpoint) {
    const response = await axios.get(`${SERVICE_B_URL}${endpoint}`, { timeout: 5000 });
    return response.data;
}

// Tạo Circuit Breaker
const circuitBreaker = new CircuitBreaker(goiServiceB, cauHinhCircuitBreaker);

// ========================================
// CÁC SỰ KIỆN CỦA CIRCUIT BREAKER
// ========================================

// Khi request thành công
circuitBreaker.on('success', (ketQua) => {
    console.log('  ✅ [CB] Request thành công');
});

// Khi request thất bại
circuitBreaker.on('failure', (loi) => {
    console.log(`  ❌ [CB] Request thất bại: ${loi.message}`);
});

// Khi circuit breaker mở (ngắt mạch)
circuitBreaker.on('open', () => {
    console.log('  🔴 [CB] Circuit OPENED - Mạch đã ngắt! Từ chối tất cả request.');
});

// Khi circuit breaker chuyển sang half-open
circuitBreaker.on('halfOpen', () => {
    console.log('  🟡 [CB] Circuit HALF-OPEN - Đang thử nghiệm...');
});

// Khi circuit breaker đóng lại (hoạt động bình thường)
circuitBreaker.on('close', () => {
    console.log('  🟢 [CB] Circuit CLOSED - Mạch hoạt động bình thường.');
});

// Khi request bị từ chối do circuit open
circuitBreaker.on('reject', () => {
    console.log('  ⛔ [CB] Request bị TỪ CHỐI - Circuit đang mở!');
});

// Khi request timeout
circuitBreaker.on('timeout', () => {
    console.log('  ⏱️ [CB] Request TIMEOUT!');
});

// Fallback khi circuit mở
circuitBreaker.fallback(() => {
    return {
        thanhCong: false,
        loi: 'Circuit Breaker đang mở - Service không khả dụng',
        fallback: true,
        thongBao: 'Dữ liệu dự phòng được trả về'
    };
});

/**
 * Thực hiện request qua Circuit Breaker
 * @param {string} endpoint - Endpoint cần gọi
 */
async function goiQuaCircuitBreaker(endpoint) {
    try {
        const trangThai = circuitBreaker.opened ? 'MỞ' :
            circuitBreaker.halfOpen ? 'NỬA MỞ' : 'ĐÓNG';
        console.log(`  📊 [CB] Trạng thái circuit: ${trangThai}`);

        const ketQua = await circuitBreaker.fire(endpoint);
        return {
            thanhCong: true,
            duLieu: ketQua,
            trangThaiCircuit: trangThai
        };
    } catch (loi) {
        return {
            thanhCong: false,
            loi: loi.message,
            trangThaiCircuit: circuitBreaker.opened ? 'MỞ' : 'ĐÓNG'
        };
    }
}

/**
 * Lấy thống kê Circuit Breaker
 */
function layThongKe() {
    const stats = circuitBreaker.stats;
    return {
        tongSoRequest: stats.fires || 0,
        thanhCong: stats.successes || 0,
        thatBai: stats.failures || 0,
        tuChoi: stats.rejects || 0,
        timeout: stats.timeouts || 0,
        trangThai: circuitBreaker.opened ? 'MỞ' :
            circuitBreaker.halfOpen ? 'NỬA MỞ' : 'ĐÓNG'
    };
}

/**
 * Reset Circuit Breaker
 */
function resetCircuit() {
    circuitBreaker.close();
    console.log('  🔄 [CB] Circuit đã được reset về trạng thái ĐÓNG');
}

/**
 * Demo Circuit Breaker Pattern
 */
async function demoCircuitBreaker() {
    console.log('\n📋 ===== DEMO CIRCUIT BREAKER PATTERN =====');
    console.log('🎯 Mô tả: Gọi endpoint /api/fail (luôn thất bại) để kích hoạt circuit breaker');
    console.log(`⚙️ Cấu hình: Ngưỡng lỗi ${cauHinhCircuitBreaker.errorThresholdPercentage}%, Reset sau ${cauHinhCircuitBreaker.resetTimeout / 1000}s\n`);

    const ketQuaList = [];

    // Gửi 7 request để trigger circuit breaker
    for (let i = 1; i <= 7; i++) {
        console.log(`\n--- Request ${i}/7 ---`);
        const ketQua = await goiQuaCircuitBreaker('/api/fail');
        ketQuaList.push(ketQua);

        // Chờ 500ms giữa các request
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n📊 Thống kê Circuit Breaker:');
    console.log(JSON.stringify(layThongKe(), null, 2));

    return {
        thongKe: layThongKe(),
        chiTiet: ketQuaList
    };
}

module.exports = {
    circuitBreaker,
    goiQuaCircuitBreaker,
    layThongKe,
    resetCircuit,
    demoCircuitBreaker,
    cauHinhCircuitBreaker
};
