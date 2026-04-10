package com.example.paymentservice.service;

import com.example.paymentservice.dto.PaymentRequest;
import com.example.paymentservice.entity.Payment;

import java.util.List;
import java.util.Map;

public interface PaymentService {
    // API chính cho Frontend gọi khi thanh toán
    Map<String, Object> processPayment(PaymentRequest request);

    // CRUD bổ sung
    List<Payment> getAllPayments();
    Payment getPaymentById(Long id);
    Payment updatePayment(Long id, Payment paymentDetails);
    void deletePayment(Long id);
}
