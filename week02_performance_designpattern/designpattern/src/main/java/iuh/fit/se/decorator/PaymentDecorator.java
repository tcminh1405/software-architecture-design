package iuh.fit.se.decorator;

/**
 * Decorator trừu tượng
 */
public abstract class PaymentDecorator implements Payment {
    protected Payment payment;

    public PaymentDecorator(Payment payment) {
        this.payment = payment;
    }

    @Override
    public double getAmount() {
        return payment.getAmount();
    }

    @Override
    public String getDescription() {
        return payment.getDescription();
    }

    @Override
    public void processPayment() {
        payment.processPayment();
    }
}
