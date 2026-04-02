const axios = require('axios');

// URL của Service B
const SERVICE_B_URL = 'http://localhost:4000';

/**
 * RATE LIMITER PATTERN - Mẫu thiết kế Giới hạn tốc độ
 * 
 * Mô tả: Giới hạn số lượng request trong một khoảng thời gian
 * - Bảo vệ service khỏi bị quá tải
 * - Sử dụng thuật toán Token Bucket
 * 
 * Cấu hình:
 * - Số request tối đa: 5 request/giây
 * - Kích thước queue: 10 request
 */

class RateLimiter {
    constructor(options = {}) {
        // Cấu hình
        this.soRequestToiDa = options.soRequestToiDa || 5;  // Số request tối đa mỗi giây
        this.kichThuocQueue = options.kichThuocQueue || 10; // Kích thước hàng đợi
        this.khoangThoiGian = options.khoangThoiGian || 1000; // Khoảng thời gian (ms)

        // Trạng thái
        this.tokens = this.soRequestToiDa;  // Số token hiện tại
        this.queue = [];                     // Hàng đợi request
        this.dangXuLy = false;

        // Thống kê
        this.thongKe = {
            tongRequest: 0,
            chapNhan: 0,
            tuChoi: 0,
            daCho: 0
        };

        // Bổ sung token định kỳ
        this.interval = setInterval(() => {
            this.tokens = Math.min(this.tokens + this.soRequestToiDa, this.soRequestToiDa);
            this.xuLyQueue();
        }, this.khoangThoiGian);

        console.log(`  ⚙️ [RATE LIMITER] Khởi tạo: ${this.soRequestToiDa} request/${this.khoangThoiGian}ms, queue: ${this.kichThuocQueue}`);
    }

    /**
     * Xử lý hàng đợi
     */
    xuLyQueue() {
        while (this.queue.length > 0 && this.tokens > 0) {
            const item = this.queue.shift();
            this.tokens--;
            item.resolve(true);
            this.thongKe.daCho++;
        }
    }

    /**
     * Yêu cầu token để thực hiện request
     * @returns {Promise<boolean>} - true nếu được phép, false nếu bị từ chối
     */
    async yeuCauToken() {
        this.thongKe.tongRequest++;

        // Nếu có token sẵn
        if (this.tokens > 0) {
            this.tokens--;
            this.thongKe.chapNhan++;
            return true;
        }

        // Nếu queue chưa đầy, thêm vào hàng đợi
        if (this.queue.length < this.kichThuocQueue) {
            return new Promise((resolve) => {
                this.queue.push({ resolve });
                console.log(`  ⏳ [RATE LIMITER] Request đang chờ trong queue (${this.queue.length}/${this.kichThuocQueue})`);
            });
        }

        // Queue đầy, từ chối request
        this.thongKe.tuChoi++;
        return false;
    }

    /**
     * Thực hiện request với Rate Limiter
     * @param {string} url - URL cần gọi
     */
    async thucHienRequest(url) {
        const duocPhep = await this.yeuCauToken();

        if (!duocPhep) {
            console.log('  ⛔ [RATE LIMITER] Request bị TỪ CHỐI - Vượt quá giới hạn!');
            return {
                thanhCong: false,
                loi: 'Rate limit exceeded - Vượt quá giới hạn tốc độ',
                tuChoi: true
            };
        }

        try {
            console.log(`  ✅ [RATE LIMITER] Request được CHẤP NHẬN (tokens còn: ${this.tokens})`);
            const response = await axios.get(url, { timeout: 5000 });
            return {
                thanhCong: true,
                duLieu: response.data
            };
        } catch (loi) {
            return {
                thanhCong: false,
                loi: loi.message
            };
        }
    }

    /**
     * Lấy thống kê
     */
    layThongKe() {
        return {
            ...this.thongKe,
            tokenConLai: this.tokens,
            queueHienTai: this.queue.length
        };
    }

    /**
     * Reset rate limiter
     */
    reset() {
        this.tokens = this.soRequestToiDa;
        this.queue = [];
        this.thongKe = {
            tongRequest: 0,
            chapNhan: 0,
            tuChoi: 0,
            daCho: 0
        };
        console.log('  🔄 [RATE LIMITER] Đã reset thống kê');
    }

    /**
     * Dừng rate limiter
     */
    dung() {
        clearInterval(this.interval);
    }
}

// Tạo instance Rate Limiter
const rateLimiter = new RateLimiter({
    soRequestToiDa: 5,     // 5 request/giây
    kichThuocQueue: 10,    // Queue tối đa 10 request
    khoangThoiGian: 1000   // Mỗi giây
});

/**
 * Demo Rate Limiter Pattern
 */
async function demoRateLimiter() {
    console.log('\n📋 ===== DEMO RATE LIMITER PATTERN =====');
    console.log('🎯 Mô tả: Gửi 15 request đồng thời để test giới hạn tốc độ');
    console.log('⚙️ Cấu hình: 5 request/giây, queue tối đa 10\n');

    // Reset trước khi demo
    rateLimiter.reset();

    // Gửi 15 request đồng thời
    const promises = [];
    for (let i = 1; i <= 15; i++) {
        console.log(`📤 Gửi request ${i}/15`);
        promises.push(
            rateLimiter.thucHienRequest(`${SERVICE_B_URL}/api/data`)
                .then(r => ({ request: i, ...r }))
        );
    }

    const ketQuaList = await Promise.all(promises);

    console.log('\n📊 Thống kê Rate Limiter:');
    console.log(JSON.stringify(rateLimiter.layThongKe(), null, 2));

    return {
        thongKe: rateLimiter.layThongKe(),
        chiTiet: ketQuaList
    };
}

module.exports = {
    RateLimiter,
    rateLimiter,
    demoRateLimiter
};
