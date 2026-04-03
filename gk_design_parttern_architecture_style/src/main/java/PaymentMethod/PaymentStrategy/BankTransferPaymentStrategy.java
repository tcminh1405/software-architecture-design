package PaymentMethod.PaymentStrategy;

// BankTransferPaymentStrategy.java
public class BankTransferPaymentStrategy implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + "đ bằng Chuyển Khoản.");
    }
}
