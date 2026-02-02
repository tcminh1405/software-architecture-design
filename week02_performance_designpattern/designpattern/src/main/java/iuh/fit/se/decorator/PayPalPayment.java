package iuh.fit.se.decorator;

/**
 * Thanh toán bằng PayPal - Concrete Component
 */
public class PayPalPayment implements Payment {
    private double amount;

    public PayPalPayment(double amount) {
        this.amount = amount;
    }

    @Override
    public double getAmount() {
        return amount;
    }

    @Override
    public String getDescription() {
        return "PayPal";
    }

    @Override
    public void processPayment() {
        System.out.println("Xử lý thanh toán bằng PayPal...");
    }
}
