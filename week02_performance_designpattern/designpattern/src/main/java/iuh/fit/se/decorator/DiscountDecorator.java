package iuh.fit.se.decorator;

/**
 * Decorator mã giảm giá - giảm 10%
 */
public class DiscountDecorator extends PaymentDecorator {
    private double discountPercent;

    public DiscountDecorator(Payment payment, double discountPercent) {
        super(payment);
        this.discountPercent = discountPercent;
    }

    @Override
    public double getAmount() {
        double discount = super.getAmount() * (discountPercent / 100);
        return super.getAmount() - discount;
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " + Giảm giá " + (int)discountPercent + "%";
    }

    @Override
    public void processPayment() {
        double discount = payment.getAmount() * (discountPercent / 100);
        System.out.println("  + Áp dụng giảm giá " + (int)discountPercent + "%: -" + String.format("%,.0f", discount) + " VND");
        super.processPayment();
    }
}
