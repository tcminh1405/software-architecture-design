package com.example.paymentservice.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long orderId;
    private String username;
    private String paymentMethod; // VD: COD, BANKING
}
