const axios = require('axios');

// URL của Service B
const SERVICE_B_URL = 'http://localhost:4000';

/**
 * RETRY PATTERN - Mẫu thiết kế Thử lại
 * 
 * Mô tả: Tự động thử lại khi request thất bại
 * - Số lần thử tối đa: 3
 * - Thời gian chờ: theo cấp số nhân (exponential backoff)
 * - Chỉ retry khi gặp lỗi 5xx hoặc lỗi mạng
 */

// Cấu hình Retry
const cauHinhRetry = {
    soLanThuToiDa: 3,          // Số lần thử tối đa
    thoiGianChoCoSo: 1000,     // Thời gian chờ cơ sở (ms)
    heSoNhan: 2                 // Hệ số nhân cho exponential backoff
};

/**
 * Hàm chờ (sleep)
 * @param {number} ms - Thời gian chờ tính bằng mili giây
 */
function cho(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Thực hiện request với Retry Pattern
 * @param {string} url - URL cần gọi
 * @param {object} options - Tùy chọn bổ sung
 */
async function goiVoiRetry(url, options = {}) {
    const {
        soLanThuToiDa = cauHinhRetry.soLanThuToiDa,
        thoiGianChoCoSo = cauHinhRetry.thoiGianChoCoSo,
        heSoNhan = cauHinhRetry.heSoNhan
    } = options;

    let lanThuCuoi;

    for (let lanThu = 1; lanThu <= soLanThuToiDa; lanThu++) {
        try {
            console.log(`  🔄 [RETRY] Lần thử ${lanThu}/${soLanThuToiDa}...`);

            const ketQua = await axios.get(url, { timeout: 10000 });

            console.log(`  ✅ [RETRY] Thành công ở lần thử ${lanThu}`);
            return {
                thanhCong: true,
                duLieu: ketQua.data,
                lanThu: lanThu,
                tongSoLanThu: soLanThuToiDa
            };

        } catch (loi) {
            lanThuCuoi = loi;
            const laLoiCoTheRetry =
                !loi.response ||                          // Lỗi mạng
                (loi.response && loi.response.status >= 500); // Lỗi server

            if (laLoiCoTheRetry && lanThu < soLanThuToiDa) {
                const thoiGianCho = thoiGianChoCoSo * Math.pow(heSoNhan, lanThu - 1);
                console.log(`  ⚠️ [RETRY] Thất bại, chờ ${thoiGianCho}ms trước khi thử lại...`);
                await cho(thoiGianCho);
            } else if (!laLoiCoTheRetry) {
                console.log(`  ❌ [RETRY] Lỗi không thể retry (mã: ${loi.response?.status})`);
                break;
            }
        }
    }

    console.log(`  ❌ [RETRY] Thất bại sau ${soLanThuToiDa} lần thử`);
    return {
        thanhCong: false,
        loi: lanThuCuoi.message,
        maLoi: lanThuCuoi.response?.status,
        tongSoLanThu: soLanThuToiDa
    };
}

/**
 * Demo Retry Pattern
 */
async function demoRetry() {
    console.log('\n📋 ===== DEMO RETRY PATTERN =====');
    console.log('🎯 Mô tả: Gọi endpoint /api/flaky (50% thất bại) với retry');
    console.log(`⚙️ Cấu hình: Tối đa ${cauHinhRetry.soLanThuToiDa} lần, backoff ${cauHinhRetry.thoiGianChoCoSo}ms\n`);

    const ketQua = await goiVoiRetry(`${SERVICE_B_URL}/api/flaky`);

    console.log('\n📊 Kết quả:');
    console.log(JSON.stringify(ketQua, null, 2));

    return ketQua;
}

module.exports = {
    goiVoiRetry,
    demoRetry,
    cauHinhRetry
};
