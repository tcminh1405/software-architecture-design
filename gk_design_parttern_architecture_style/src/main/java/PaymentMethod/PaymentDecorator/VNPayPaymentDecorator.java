package PaymentMethod.PaymentDecorator;

// VNPayPaymentDecorator.java
public class VNPayPaymentDecorator extends PaymentDecorator {
    public VNPayPaymentDecorator(Payment payment) {
        super(payment);
    }
    @Override
    public void pay(double amount) {
        System.out.println("Phương thức: VN Pay");
        super.pay(amount);
    }
}
