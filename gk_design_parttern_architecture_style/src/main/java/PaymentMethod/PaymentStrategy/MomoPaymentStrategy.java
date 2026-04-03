package PaymentMethod.PaymentStrategy;

// MomoPaymentStrategy.java
public class MomoPaymentStrategy implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + "đ bằng Momo.");
    }
}
