package com.example.paymentservice.service;

import com.example.paymentservice.dto.PaymentRequest;
import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Value("${order-service.url}")
    private String orderServiceUrl;

    private final RestTemplate restTemplate;
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.restTemplate = new RestTemplate();
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Map<String, Object> processPayment(PaymentRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Lưu giao dịch xuống DB (Payment Repository)
            Payment payment = new Payment();
            payment.setOrderId(request.getOrderId());
            payment.setUsername(request.getUsername());
            payment.setPaymentMethod(request.getPaymentMethod());
            // Giả lập logic kiểm tra: nếu là BANKING, delay 2s để demo giao diện load
            if ("BANKING".equalsIgnoreCase(request.getPaymentMethod())) {
                Thread.sleep(2000); 
            }
            payment.setStatus("SUCCESS");
            
            // Ở đồ án sinh viên thường amount truyền từ frontend lên hoặc tự gọi order-service lấy.
            payment.setAmount(0.0); // Giả lập tiền mặt chưa cần tính toán chặt

            paymentRepository.save(payment);

            // 2. Cập nhật trạng thái đơn hàng (gọi Order Service qua mạng)
            String updateOrderStatusUrl = orderServiceUrl + "/api/orders/" + request.getOrderId() + "/status?status=PAID";
            try {
                 restTemplate.put(updateOrderStatusUrl, null);
            } catch (Exception apiEx) {
                 logger.warn("Không thể gọi tới Order Service (có thể Service đó đang tắt): {}", apiEx.getMessage());
                 // Tùy nghiệp vụ: có thể vẫn cho thanh toán DB thành công nhưng báo Order tịt.
            }

            // 3. Gửi notification (Log ra console chuẩn cấu trúc theo yêu cầu đồ án)
            logger.info("=========== THÔNG BÁO ===========");
            logger.info("User {} đã đặt đơn #{} thành công với hình thức {}", 
                    request.getUsername(), request.getOrderId(), request.getPaymentMethod());
            logger.info("Mã giao dịch lưu db: {}", payment.getId());
            logger.info("=================================");

            // 4. Build response trả về Frontend
            response.put("success", true);
            response.put("message", "Thanh toán thành công");
            response.put("transactionId", payment.getId());
            response.put("orderId", request.getOrderId());
            
        } catch (Exception e) {
            logger.error("Lỗi hệ thống khi thanh toán: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Lỗi nạp tiền: " + e.getMessage());
        }

        return response;
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch với ID: " + id));
    }

    @Override
    public Payment updatePayment(Long id, Payment paymentDetails) {
        Payment payment = getPaymentById(id);
        
        payment.setOrderId(paymentDetails.getOrderId());
        payment.setUsername(paymentDetails.getUsername());
        payment.setAmount(paymentDetails.getAmount());
        payment.setPaymentMethod(paymentDetails.getPaymentMethod());
        payment.setStatus(paymentDetails.getStatus());
        
        return paymentRepository.save(payment);
    }

    @Override
    public void deletePayment(Long id) {
        Payment payment = getPaymentById(id);
        paymentRepository.delete(payment);
    }
}

