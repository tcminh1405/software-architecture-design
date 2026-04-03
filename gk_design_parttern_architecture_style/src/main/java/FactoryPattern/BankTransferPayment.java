package FactoryPattern;

public class BankTransferPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán chuyển khoản: " + amount);
    }
}
