package PaymentMethod.PaymentStrategy;

// ZaloPayPaymentStrategy.java - Câu 2 (Strategy)
public class ZaloPayPaymentStrategy implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + "đ bằng ZaloPay.");
    }
}
