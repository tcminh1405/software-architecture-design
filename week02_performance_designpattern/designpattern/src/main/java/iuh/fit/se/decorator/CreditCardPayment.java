package iuh.fit.se.decorator;

/**
 * Thanh toán bằng thẻ tín dụng - Concrete Component
 */
public class CreditCardPayment implements Payment {
    private double amount;

    public CreditCardPayment(double amount) {
        this.amount = amount;
    }

    @Override
    public double getAmount() {
        return amount;
    }

    @Override
    public String getDescription() {
        return "Thẻ tín dụng";
    }

    @Override
    public void processPayment() {
        System.out.println("Xử lý thanh toán bằng thẻ tín dụng...");
    }
}
