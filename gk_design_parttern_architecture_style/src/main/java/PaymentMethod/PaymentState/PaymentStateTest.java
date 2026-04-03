package PaymentMethod.PaymentState;

// PaymentStateTest.java (Main)
public class PaymentStateTest {
    public static void main(String[] args) {
        PaymentContext context = new PaymentContext(new CashState());
        context.handlePayment(1000); // Sẽ in: Tiền mặt, sau đó chuyển sang BankTransfer
        context.handlePayment(2000); // Xử lý theo BankTransfer, chuyển sang Momo
        context.handlePayment(3000); // Xử lý theo Momo, chuyển sang VNPay
        context.handlePayment(4000); // Xử lý theo VNPay, chuyển về Tiền mặt
    }
}
