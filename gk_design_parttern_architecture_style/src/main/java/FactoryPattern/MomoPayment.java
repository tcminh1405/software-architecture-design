package FactoryPattern;

public class MomoPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán qua Momo: " + amount);
    }
}
