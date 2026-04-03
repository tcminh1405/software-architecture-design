package PaymentMethod.PaymentDecorator;

// MomoPaymentDecorator.java
public class MomoPaymentDecorator extends PaymentDecorator {
    public MomoPaymentDecorator(Payment payment) {
        super(payment);
    }
    @Override
    public void pay(double amount) {
        System.out.println("Phương thức: Momo");
        super.pay(amount);
    }
}
