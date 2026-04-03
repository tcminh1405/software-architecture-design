package PaymentMethod.PaymentState;

public class MomoState implements PaymentState {
    public void handle(PaymentContext context, double amount) {
        System.out.println("Thanh toán bằng Momo: " + amount);
        context.setState(new VNPayState());
    }
    public String getMethod() { return "Momo"; }
}
