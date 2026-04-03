package PaymentMethod.PaymentState;

public class CashState implements PaymentState {
    public void handle(PaymentContext context, double amount) {
        System.out.println("Thanh toán bằng Tiền mặt: " + amount);
        // Sau khi thực hiện, chuyển sang trạng thái kế tiếp (ví dụ: Chuyển Khoản)
        context.setState(new BankTransferState());
    }
    public String getMethod() { return "Tiền mặt"; }
}
