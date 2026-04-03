package PaymentMethod.PaymentState;

public class PaymentContext {
    private PaymentState state;
    public PaymentContext(PaymentState state) {
        this.state = state;
    }
    public void setState(PaymentState state) {
        this.state = state;
    }
    public void handlePayment(double amount) {
        System.out.println("Phương thức thanh toán hiện tại: " + state.getMethod());
        state.handle(this, amount);
    }
}
