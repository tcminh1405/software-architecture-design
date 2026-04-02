const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Biến đếm số request
let soRequest = 0;

// Middleware ghi log mỗi request
app.use((req, res, next) => {
    soRequest++;
    const thoiGian = new Date().toISOString();
    console.log(`[${thoiGian}] #${soRequest} ${req.method} ${req.path}`);
    next();
});

// ========================================
// ENDPOINT 1: Phản hồi bình thường
// ========================================
app.get('/api/data', (req, res) => {
    console.log('  ✅ Trả về dữ liệu bình thường');
    res.json({
        thanhCong: true,
        thongBao: 'Lấy dữ liệu thành công',
        duLieu: {
            id: 1,
            ten: 'Dữ liệu mẫu',
            thoiGian: new Date().toISOString()
        }
    });
});

// ========================================
// ENDPOINT 2: Phản hồi chậm (2-5 giây)
// ========================================
app.get('/api/slow', async (req, res) => {
    const doTre = Math.floor(Math.random() * 3000) + 2000; // 2000-5000ms
    console.log(`  ⏳ Đang xử lý chậm (${doTre}ms)...`);

    await new Promise(resolve => setTimeout(resolve, doTre));

    console.log('  ✅ Xử lý chậm hoàn tất');
    res.json({
        thanhCong: true,
        thongBao: 'Hoàn tất xử lý chậm',
        doTre: `${doTre}ms`,
        duLieu: { ketQua: 'Tính toán nặng hoàn tất' }
    });
});

// ========================================
// ENDPOINT 3: Phản hồi không ổn định (50% thất bại)
// ========================================
app.get('/api/flaky', (req, res) => {
    const seLoiHay = Math.random() < 0.5;

    if (seLoiHay) {
        console.log('  ❌ Endpoint không ổn định: THẤT BẠI (lỗi ngẫu nhiên)');
        res.status(500).json({
            thanhCong: false,
            loi: 'Xảy ra lỗi ngẫu nhiên',
            thongBao: 'Endpoint này thất bại 50% số lần'
        });
    } else {
        console.log('  ✅ Endpoint không ổn định: THÀNH CÔNG');
        res.json({
            thanhCong: true,
            thongBao: 'Request thành công (may mắn!)',
            duLieu: { ketQua: 'Thành công không ổn định' }
        });
    }
});

// ========================================
// ENDPOINT 4: Luôn thất bại (Lỗi 500)
// ========================================
app.get('/api/fail', (req, res) => {
    console.log('  ❌ Endpoint luôn thất bại được gọi');
    res.status(500).json({
        thanhCong: false,
        loi: 'Lỗi máy chủ nội bộ',
        thongBao: 'Endpoint này luôn thất bại'
    });
});

// ========================================
// ENDPOINT 5: Xử lý nặng (Test Bulkhead)
// ========================================
app.get('/api/heavy', async (req, res) => {
    const thoiGianXuLy = Math.floor(Math.random() * 2000) + 1000; // 1-3 giây
    console.log(`  🔄 Bắt đầu xử lý nặng (${thoiGianXuLy}ms)...`);

    // Giả lập công việc tốn CPU
    await new Promise(resolve => setTimeout(resolve, thoiGianXuLy));

    console.log('  ✅ Xử lý nặng hoàn tất');
    res.json({
        thanhCong: true,
        thongBao: 'Hoàn tất xử lý nặng',
        thoiGianXuLy: `${thoiGianXuLy}ms`,
        duLieu: { ketQua: 'Tác vụ tốn tài nguyên hoàn tất' }
    });
});

// ========================================
// ENDPOINT 6: Tỷ lệ lỗi tùy chỉnh
// ========================================
app.get('/api/configurable', (req, res) => {
    const tyLeLoi = parseFloat(req.query.failRate) || 0.3; // Mặc định 30%
    const seLoiHay = Math.random() < tyLeLoi;

    if (seLoiHay) {
        console.log(`  ❌ Endpoint tùy chỉnh: THẤT BẠI (tỷ lệ: ${tyLeLoi * 100}%)`);
        res.status(500).json({
            thanhCong: false,
            loi: 'Lỗi theo cấu hình',
            tyLeLoi: `${tyLeLoi * 100}%`
        });
    } else {
        console.log(`  ✅ Endpoint tùy chỉnh: THÀNH CÔNG (tỷ lệ: ${tyLeLoi * 100}%)`);
        res.json({
            thanhCong: true,
            thongBao: 'Request thành công',
            tyLeLoi: `${tyLeLoi * 100}%`,
            duLieu: { ketQua: 'Thành công tùy chỉnh' }
        });
    }
});

// Kiểm tra sức khỏe
app.get('/health', (req, res) => {
    res.json({ trangThai: 'HOẠT ĐỘNG', dichVu: 'service-b', cong: PORT });
});

// Khởi động server
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║       SERVICE B - Máy chủ Backend              ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║  🚀 Đang chạy tại: http://localhost:${PORT}        ║`);
    console.log('╠════════════════════════════════════════════════╣');
    console.log('║  Các Endpoint:                                 ║');
    console.log('║  • GET /api/data        - Phản hồi bình thường ║');
    console.log('║  • GET /api/slow        - Chậm (2-5 giây)      ║');
    console.log('║  • GET /api/flaky       - 50% thất bại         ║');
    console.log('║  • GET /api/fail        - Luôn thất bại        ║');
    console.log('║  • GET /api/heavy       - Xử lý nặng           ║');
    console.log('║  • GET /api/configurable - Tỷ lệ lỗi tùy chỉnh ║');
    console.log('║  • GET /health          - Kiểm tra sức khỏe    ║');
    console.log('╚════════════════════════════════════════════════╝');
});
