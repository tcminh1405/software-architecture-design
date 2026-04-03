package PaymentMethod.PaymentState;

public interface PaymentState {
    void handle(PaymentContext context, double amount);
    String getMethod();
}
