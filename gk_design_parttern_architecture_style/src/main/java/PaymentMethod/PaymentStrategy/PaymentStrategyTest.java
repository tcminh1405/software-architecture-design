package PaymentMethod.PaymentStrategy;

import SingletonPattern.DatabaseConnection;

// PaymentStrategyTest.java - Kiểm thử Câu 1 & 2
public class PaymentStrategyTest {
    public static void main(String[] args) {
        // --- KIỂM THỬ CÂU 1 (SINGLETON) ---
        System.out.println("=== CÂU 1: SINGLETON PATTERN ===");
        DatabaseConnection conn1 = DatabaseConnection.getInstance();
        DatabaseConnection conn2 = DatabaseConnection.getInstance();
        
        conn1.executeQuery("SELECT * FROM Tau");
        
        if (conn1 == conn2) {
            System.out.println("Kiểm chứng: conn1 và conn2 là cùng 1 instance! (Thành công)");
        }
        System.out.println();

        // --- KIỂM THỬ CÂU 2 (STRATEGY PATTERN) ---
        System.out.println("=== CÂU 2: STRATEGY PATTERN ===");
        // Khởi tạo Context với chiến lược mặc định Credit Card
        PaymentContextStrategy context = new PaymentContextStrategy(new CreditCardPaymentStrategy());
        context.executePayment(500000);

        // Đổi sang Momo
        context.setStrategy(new MomoPaymentStrategy());
        context.executePayment(200000);

        // Đổi sang ZaloPay
        context.setStrategy(new ZaloPayPaymentStrategy());
        context.executePayment(300000);
        
        // Dễ dàng thêm mới (như VNPay) mà không sửa code cũ
        context.setStrategy(new VNPayPaymentStrategy());
        context.executePayment(450000);
    }
}
