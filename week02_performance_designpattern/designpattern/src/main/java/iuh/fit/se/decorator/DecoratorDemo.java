package iuh.fit.se.decorator;

/**
 * Demo Decorator Pattern - Bài 3: Hệ thống thanh toán
 */
public class DecoratorDemo {
    public static void main(String[] args) {

        System.out.println("  BÀI 3: DECORATOR PATTERN - HỆ THỐNG THANH TOÁN");


        // Thanh toán cơ bản bằng thẻ tín dụng
        System.out.println("\n--- Thanh toán thẻ tín dụng cơ bản ---");
        Payment payment1 = new CreditCardPayment(100000);
        System.out.println("Mô tả: " + payment1.getDescription());
        System.out.println("Số tiền: " + String.format("%,.0f", payment1.getAmount()) + " VND");
        payment1.processPayment();

        // Thêm phí xử lý
        System.out.println("\n--- Thêm phí xử lý ---");
        Payment payment2 = new ProcessingFeeDecorator(new CreditCardPayment(100000));
        System.out.println("Mô tả: " + payment2.getDescription());
        System.out.println("Số tiền: " + String.format("%,.0f", payment2.getAmount()) + " VND");
        payment2.processPayment();

        // PayPal + Giảm giá
        System.out.println("\n--- PayPal + Giảm giá 10% ---");
        Payment payment3 = new DiscountDecorator(new PayPalPayment(100000), 10);
        System.out.println("Mô tả: " + payment3.getDescription());
        System.out.println("Số tiền: " + String.format("%,.0f", payment3.getAmount()) + " VND");
        payment3.processPayment();

        // Kết hợp: Thẻ tín dụng + Phí xử lý + Giảm giá
        System.out.println("\n--- Thẻ tín dụng + Phí xử lý + Giảm giá 15% ---");
        Payment payment4 = new DiscountDecorator(
                new ProcessingFeeDecorator(new CreditCardPayment(100000)), 15);
        System.out.println("Mô tả: " + payment4.getDescription());
        System.out.println("Số tiền: " + String.format("%,.0f", payment4.getAmount()) + " VND");
        payment4.processPayment();

        // Kết luận
        System.out.println("\n╔══════════════════════════════════════════════════╗");
        System.out.println("║                    KẾT LUẬN                      ║");
        System.out.println("╠══════════════════════════════════════════════════╣");
        System.out.println("║ Decorator Pattern cho phép thêm tính năng động   ║");
        System.out.println("║ vào đối tượng mà không cần tạo subclass.         ║");
        System.out.println("║                                                  ║");
        System.out.println("║ Ưu điểm:                                         ║");
        System.out.println("║ - Linh hoạt kết hợp các tính năng                ║");
        System.out.println("║ - Tránh bùng nổ subclass                         ║");
        System.out.println("║ - Tuân thủ nguyên tắc Single Responsibility      ║");
        System.out.println("╚══════════════════════════════════════════════════╝");
    }
}
