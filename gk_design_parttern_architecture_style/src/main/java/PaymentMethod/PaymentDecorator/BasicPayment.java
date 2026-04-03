package PaymentMethod.PaymentDecorator;

// BasicPayment.java
public class BasicPayment implements Payment {
    public void pay(double amount) {
        System.out.println("Thanh toán số tiền: " + amount);
    }
}
