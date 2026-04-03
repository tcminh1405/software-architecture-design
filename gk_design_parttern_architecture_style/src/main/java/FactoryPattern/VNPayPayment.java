package FactoryPattern;

public class VNPayPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán qua VN Pay: " + amount);
    }
}
