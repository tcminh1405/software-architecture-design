package PaymentMethod.PaymentDecorator;

// PaymentDecorator.java
public abstract class PaymentDecorator implements Payment {
    protected Payment payment;
    public PaymentDecorator(Payment payment) {
        this.payment = payment;
    }
    public void pay(double amount) {
        payment.pay(amount);
    }
}
