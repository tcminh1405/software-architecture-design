package PaymentMethod.PaymentState;

public class VNPayState implements PaymentState {
    public void handle(PaymentContext context, double amount) {
        System.out.println("Thanh toán bằng VN Pay: " + amount);
        // Kết thúc chu trình chuyển trạng thái (hoặc chuyển về trạng thái ban đầu)
        context.setState(new CashState());
    }
    public String getMethod() { return "VN Pay"; }
}
