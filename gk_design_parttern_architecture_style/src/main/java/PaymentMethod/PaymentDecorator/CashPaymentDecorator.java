package PaymentMethod.PaymentDecorator;

// CashPaymentDecorator.java
public class CashPaymentDecorator extends PaymentDecorator {
    public CashPaymentDecorator(Payment payment) {
        super(payment);
    }
    @Override
    public void pay(double amount) {
        System.out.println("Phương thức: Tiền mặt");
        super.pay(amount);
    }
}
