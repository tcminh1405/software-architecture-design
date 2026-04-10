package com.example.paymentservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    
    private String username;

    private Double amount;
    
    private String paymentMethod;
    
    private String status;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date transactionDate;

    @PrePersist
    protected void onCreate() {
        transactionDate = new Date();
    }
}
