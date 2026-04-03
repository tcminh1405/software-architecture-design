package PaymentMethod.PaymentStrategy;

// CreditCardPaymentStrategy.java - Câu 2 (Strategy)
public class CreditCardPaymentStrategy implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + "đ bằng Credit Card.");
    }
}
