package PaymentMethod.PaymentStrategy;

// VNPayPaymentStrategy.java
public class VNPayPaymentStrategy implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + "đ bằng VNPay.");
    }
}
