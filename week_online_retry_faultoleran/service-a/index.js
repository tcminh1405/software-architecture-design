const express = require('express');
const cors = require('cors');

// Import các Fault Tolerance patterns
const { demoRetry, goiVoiRetry, cauHinhRetry } = require('./patterns/retry');
const { demoCircuitBreaker, goiQuaCircuitBreaker, layThongKe: layThongKeCB, resetCircuit, cauHinhCircuitBreaker } = require('./patterns/circuitBreaker');
const { demoRateLimiter, rateLimiter } = require('./patterns/rateLimiter');
const { demoBulkhead, bulkhead } = require('./patterns/bulkhead');

const app = express();
const PORT = 3000;

// URL của Service B
const SERVICE_B_URL = 'http://localhost:4000';

app.use(cors());
app.use(express.json());

// Biến đếm request
let soRequest = 0;

// Middleware ghi log
app.use((req, res, next) => {
    soRequest++;
    const thoiGian = new Date().toISOString();
    console.log(`\n[${thoiGian}] #${soRequest} ${req.method} ${req.path}`);
    next();
});

// ========================================
// TRANG CHỦ - Hướng dẫn sử dụng
// ========================================
app.get('/', (req, res) => {
    res.json({
        dichVu: 'Service A - Fault Tolerance Demo',
        moTa: 'Demo các patterns Fault Tolerance tương tự Resilience4J',
        endpoints: {
            retry: {
                demo: 'GET /demo/retry',
                moTa: 'Demo Retry Pattern - Tự động thử lại khi thất bại'
            },
            circuitBreaker: {
                demo: 'GET /demo/circuit-breaker',
                moTa: 'Demo Circuit Breaker - Ngắt mạch khi có lỗi liên tục',
                reset: 'POST /demo/circuit-breaker/reset'
            },
            rateLimiter: {
                demo: 'GET /demo/rate-limiter',
                moTa: 'Demo Rate Limiter - Giới hạn số request mỗi giây'
            },
            bulkhead: {
                demo: 'GET /demo/bulkhead',
                moTa: 'Demo Bulkhead - Giới hạn số request đồng thời'
            },
            all: {
                demo: 'GET /demo/all',
                moTa: 'Demo tất cả patterns'
            }
        }
    });
});

// ========================================
// DEMO 1: RETRY PATTERN
// ========================================
app.get('/demo/retry', async (req, res) => {
    console.log('\n🚀 Bắt đầu demo RETRY PATTERN');

    try {
        const ketQua = await demoRetry();
        res.json({
            pattern: 'RETRY',
            moTa: 'Tự động thử lại request khi thất bại',
            cauHinh: cauHinhRetry,
            ketQua: ketQua
        });
    } catch (loi) {
        res.status(500).json({
            pattern: 'RETRY',
            loi: loi.message
        });
    }
});

// ========================================
// DEMO 2: CIRCUIT BREAKER PATTERN
// ========================================
app.get('/demo/circuit-breaker', async (req, res) => {
    console.log('\n🚀 Bắt đầu demo CIRCUIT BREAKER PATTERN');

    try {
        const ketQua = await demoCircuitBreaker();
        res.json({
            pattern: 'CIRCUIT BREAKER',
            moTa: 'Ngắt mạch khi phát hiện nhiều lỗi liên tiếp',
            cauHinh: cauHinhCircuitBreaker,
            ketQua: ketQua
        });
    } catch (loi) {
        res.status(500).json({
            pattern: 'CIRCUIT BREAKER',
            loi: loi.message
        });
    }
});

// Reset Circuit Breaker
app.post('/demo/circuit-breaker/reset', (req, res) => {
    resetCircuit();
    res.json({
        thanhCong: true,
        thongBao: 'Circuit Breaker đã được reset',
        thongKe: layThongKeCB()
    });
});

// Lấy trạng thái Circuit Breaker
app.get('/demo/circuit-breaker/status', (req, res) => {
    res.json({
        pattern: 'CIRCUIT BREAKER',
        thongKe: layThongKeCB()
    });
});

// ========================================
// DEMO 3: RATE LIMITER PATTERN
// ========================================
app.get('/demo/rate-limiter', async (req, res) => {
    console.log('\n🚀 Bắt đầu demo RATE LIMITER PATTERN');

    try {
        const ketQua = await demoRateLimiter();
        res.json({
            pattern: 'RATE LIMITER',
            moTa: 'Giới hạn số lượng request trong một khoảng thời gian',
            cauHinh: {
                soRequestToiDa: 5,
                khoangThoiGian: '1 giây',
                kichThuocQueue: 10
            },
            ketQua: ketQua
        });
    } catch (loi) {
        res.status(500).json({
            pattern: 'RATE LIMITER',
            loi: loi.message
        });
    }
});

// Lấy trạng thái Rate Limiter
app.get('/demo/rate-limiter/status', (req, res) => {
    res.json({
        pattern: 'RATE LIMITER',
        thongKe: rateLimiter.layThongKe()
    });
});

// ========================================
// DEMO 4: BULKHEAD PATTERN
// ========================================
app.get('/demo/bulkhead', async (req, res) => {
    console.log('\n🚀 Bắt đầu demo BULKHEAD PATTERN');

    try {
        const ketQua = await demoBulkhead();
        res.json({
            pattern: 'BULKHEAD',
            moTa: 'Giới hạn số lượng request đồng thời, cô lập tài nguyên',
            cauHinh: {
                maxConcurrent: 3,
                kichThuocQueue: 5
            },
            ketQua: ketQua
        });
    } catch (loi) {
        res.status(500).json({
            pattern: 'BULKHEAD',
            loi: loi.message
        });
    }
});

// Lấy trạng thái Bulkhead
app.get('/demo/bulkhead/status', (req, res) => {
    res.json({
        pattern: 'BULKHEAD',
        thongKe: bulkhead.layThongKe()
    });
});

// ========================================
// DEMO TẤT CẢ PATTERNS
// ========================================
app.get('/demo/all', async (req, res) => {
    console.log('\n🚀 Bắt đầu demo TẤT CẢ PATTERNS');

    const ketQua = {
        moTa: 'Demo tất cả Fault Tolerance Patterns',
        patterns: {}
    };

    // Demo Retry
    console.log('\n--- RETRY ---');
    ketQua.patterns.retry = await demoRetry();

    // Chờ 2 giây
    await new Promise(r => setTimeout(r, 2000));

    // Demo Circuit Breaker
    console.log('\n--- CIRCUIT BREAKER ---');
    resetCircuit(); // Reset trước khi demo
    ketQua.patterns.circuitBreaker = await demoCircuitBreaker();

    // Chờ 2 giây
    await new Promise(r => setTimeout(r, 2000));

    // Demo Rate Limiter
    console.log('\n--- RATE LIMITER ---');
    ketQua.patterns.rateLimiter = await demoRateLimiter();

    // Chờ 2 giây
    await new Promise(r => setTimeout(r, 2000));

    // Demo Bulkhead
    console.log('\n--- BULKHEAD ---');
    ketQua.patterns.bulkhead = await demoBulkhead();

    res.json(ketQua);
});

// ========================================
// HEALTH CHECK
// ========================================
app.get('/health', (req, res) => {
    res.json({
        trangThai: 'HOẠT ĐỘNG',
        dichVu: 'service-a',
        cong: PORT,
        serviceBUrl: SERVICE_B_URL
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║       SERVICE A - Fault Tolerance Demo                    ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║  🚀 Đang chạy tại: http://localhost:${PORT}                    ║`);
    console.log(`║  📡 Kết nối đến Service B: ${SERVICE_B_URL}             ║`);
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  Demo Endpoints:                                          ║');
    console.log('║  • GET /demo/retry          - Demo Retry Pattern          ║');
    console.log('║  • GET /demo/circuit-breaker - Demo Circuit Breaker       ║');
    console.log('║  • GET /demo/rate-limiter   - Demo Rate Limiter           ║');
    console.log('║  • GET /demo/bulkhead       - Demo Bulkhead Pattern       ║');
    console.log('║  • GET /demo/all            - Demo tất cả patterns        ║');
    console.log('║  • GET /health              - Kiểm tra sức khỏe           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('\n⚠️ Lưu ý: Hãy khởi động Service B trước khi test!');
});
