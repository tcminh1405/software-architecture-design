const axios = require('axios');

// URL của Service B
const SERVICE_B_URL = 'http://localhost:4000';

/**
 * BULKHEAD PATTERN - Mẫu thiết kế Vách ngăn
 * 
 * Mô tả: Cô lập tài nguyên, giới hạn số lượng request đồng thời
 * - Ngăn chặn một service lỗi làm ảnh hưởng toàn bộ hệ thống
 * - Giới hạn concurrent connections
 * 
 * Cấu hình:
 * - Số concurrent tối đa: 3
 * - Kích thước queue: 5
 */

class Bulkhead {
    constructor(options = {}) {
        // Cấu hình
        this.maxConcurrent = options.maxConcurrent || 3;  // Số request đồng thời tối đa
        this.kichThuocQueue = options.kichThuocQueue || 5; // Kích thước hàng đợi

        // Trạng thái
        this.dangChay = 0;      // Số request đang chạy
        this.queue = [];        // Hàng đợi request

        // Thống kê
        this.thongKe = {
            tongRequest: 0,
            thanhCong: 0,
            thatBai: 0,
            tuChoi: 0,
            daCho: 0,
            concurrentCaoNhat: 0
        };

        console.log(`  ⚙️ [BULKHEAD] Khởi tạo: max concurrent ${this.maxConcurrent}, queue ${this.kichThuocQueue}`);
    }

    /**
     * Xử lý request tiếp theo trong queue
     */
    xuLyTiepTheo() {
        if (this.queue.length > 0 && this.dangChay < this.maxConcurrent) {
            const item = this.queue.shift();
            this.thongKe.daCho++;
            this._thucHien(item.fn, item.resolve, item.reject);
        }
    }

    /**
     * Thực hiện request thực sự
     */
    async _thucHien(fn, resolve, reject) {
        this.dangChay++;
        this.thongKe.concurrentCaoNhat = Math.max(this.thongKe.concurrentCaoNhat, this.dangChay);

        console.log(`  🔄 [BULKHEAD] Đang xử lý (${this.dangChay}/${this.maxConcurrent} concurrent)`);

        try {
            const ketQua = await fn();
            this.thongKe.thanhCong++;
            resolve({
                thanhCong: true,
                duLieu: ketQua
            });
        } catch (loi) {
            this.thongKe.thatBai++;
            reject({
                thanhCong: false,
                loi: loi.message
            });
        } finally {
            this.dangChay--;
            console.log(`  ✅ [BULKHEAD] Hoàn tất (${this.dangChay}/${this.maxConcurrent} concurrent)`);
            this.xuLyTiepTheo();
        }
    }

    /**
     * Thực hiện request qua Bulkhead
     * @param {Function} fn - Hàm async cần thực hiện
     */
    async thucHien(fn) {
        this.thongKe.tongRequest++;

        return new Promise((resolve, reject) => {
            // Nếu còn slot trống
            if (this.dangChay < this.maxConcurrent) {
                this._thucHien(fn, resolve, reject);
            }
            // Nếu queue chưa đầy
            else if (this.queue.length < this.kichThuocQueue) {
                console.log(`  ⏳ [BULKHEAD] Request đang chờ trong queue (${this.queue.length + 1}/${this.kichThuocQueue})`);
                this.queue.push({ fn, resolve, reject });
            }
            // Queue đầy
            else {
                this.thongKe.tuChoi++;
                console.log('  ⛔ [BULKHEAD] Request bị TỪ CHỐI - Bulkhead đầy!');
                resolve({
                    thanhCong: false,
                    loi: 'Bulkhead full - Hệ thống quá tải',
                    tuChoi: true
                });
            }
        });
    }

    /**
     * Gọi HTTP request qua Bulkhead
     * @param {string} url - URL cần gọi
     */
    async goiHttp(url) {
        return this.thucHien(async () => {
            const response = await axios.get(url, { timeout: 10000 });
            return response.data;
        });
    }

    /**
     * Lấy thống kê
     */
    layThongKe() {
        return {
            ...this.thongKe,
            dangChay: this.dangChay,
            queueHienTai: this.queue.length
        };
    }

    /**
     * Reset bulkhead
     */
    reset() {
        this.thongKe = {
            tongRequest: 0,
            thanhCong: 0,
            thatBai: 0,
            tuChoi: 0,
            daCho: 0,
            concurrentCaoNhat: 0
        };
        console.log('  🔄 [BULKHEAD] Đã reset thống kê');
    }
}

// Tạo instance Bulkhead
const bulkhead = new Bulkhead({
    maxConcurrent: 3,   // 3 request đồng thời
    kichThuocQueue: 5   // Queue tối đa 5 request
});

/**
 * Demo Bulkhead Pattern
 */
async function demoBulkhead() {
    console.log('\n📋 ===== DEMO BULKHEAD PATTERN =====');
    console.log('🎯 Mô tả: Gửi 10 request đồng thời đến endpoint /api/heavy');
    console.log('⚙️ Cấu hình: max concurrent 3, queue 5\n');

    // Reset trước khi demo
    bulkhead.reset();

    // Gửi 10 request đồng thời đến endpoint heavy (xử lý chậm)
    const promises = [];
    for (let i = 1; i <= 10; i++) {
        console.log(`📤 Gửi request ${i}/10`);
        promises.push(
            bulkhead.goiHttp(`${SERVICE_B_URL}/api/heavy`)
                .then(r => ({ request: i, ...r }))
                .catch(e => ({ request: i, thanhCong: false, loi: e.loi || e.message }))
        );
    }

    const ketQuaList = await Promise.all(promises);

    console.log('\n📊 Thống kê Bulkhead:');
    console.log(JSON.stringify(bulkhead.layThongKe(), null, 2));

    return {
        thongKe: bulkhead.layThongKe(),
        chiTiet: ketQuaList
    };
}

module.exports = {
    Bulkhead,
    bulkhead,
    demoBulkhead
};
