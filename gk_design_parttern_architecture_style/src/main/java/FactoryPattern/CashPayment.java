package FactoryPattern;

// Các lớp thanh toán cụ thể:
public class CashPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán tiền mặt: " + amount);
    }
}
