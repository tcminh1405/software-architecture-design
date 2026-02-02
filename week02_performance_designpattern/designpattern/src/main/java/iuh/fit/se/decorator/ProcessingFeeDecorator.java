package iuh.fit.se.decorator;

/**
 * Decorator thêm phí xử lý - 5000 VND
 */
public class ProcessingFeeDecorator extends PaymentDecorator {
    private static final double FEE = 5000;

    public ProcessingFeeDecorator(Payment payment) {
        super(payment);
    }

    @Override
    public double getAmount() {
        return super.getAmount() + FEE;
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " + Phí xử lý";
    }

    @Override
    public void processPayment() {
        System.out.println("  + Thêm phí xử lý: " + String.format("%,.0f", FEE) + " VND");
        super.processPayment();
    }
}
