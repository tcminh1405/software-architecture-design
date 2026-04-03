package PaymentMethod.PaymentState;

public class BankTransferState implements PaymentState {
    public void handle(PaymentContext context, double amount) {
        System.out.println("Thanh toán bằng Chuyển Khoản: " + amount);
        context.setState(new MomoState());
    }
    public String getMethod() { return "Chuyển Khoản"; }
}
