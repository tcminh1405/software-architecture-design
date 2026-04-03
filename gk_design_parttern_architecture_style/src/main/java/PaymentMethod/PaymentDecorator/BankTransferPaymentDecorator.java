package PaymentMethod.PaymentDecorator;

// BankTransferPaymentDecorator.java
public class BankTransferPaymentDecorator extends PaymentDecorator {
    public BankTransferPaymentDecorator(Payment payment) {
        super(payment);
    }
    @Override
    public void pay(double amount) {
        System.out.println("Phương thức: Chuyển Khoản");
        super.pay(amount);
    }
}
