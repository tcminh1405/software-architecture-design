package org.example;
import FactoryPattern.PaymentFactory;
import FactoryPattern.PaymentStrategy;
import PaymentMethod.PaymentStrategy.*;
import SingletonPattern.DatabaseConnection;
import SingletonPattern.Logger;

public class Main {
    public static void main(String[] args) {
        //1a.Singleton Pattern đảm bảo rằng chỉ có một instance của lớp được tạo ra trong suốt vòng đời của ứng dụng.
        // Ví dụ: lớp Logger dùng để ghi log chung cho toàn ứng dụng.
        //- Mọi thao tác ghi log trong ứng dụng đều được quản lý bởi cùng một đối tượng Logger.
        //  Điều này giúp thống nhất định dạng log, quản lý file log (nếu ghi ra file) và dễ dàng bảo trì.

        //- Nếu sau này cần thay đổi cơ chế ghi log (ví dụ ghi vào file hoặc cơ sở dữ liệu),
        //  chỉ cần chỉnh sửa trong lớp Logger mà không ảnh hưởng đến các phần khác của ứng dụng.

        //- Việc sử dụng Singleton cho phép kiểm soát chặt chẽ việc truy cập đến đối tượng Logger,
        //  tránh tình trạng xung đột khi có nhiều đối tượng cùng thao tác ghi log.
        Logger logger1 = Logger.getInstance();
        Logger logger2 = Logger.getInstance();
        logger1.log("Bắt đầu chương trình...");

        // // Kiểm chứng 2 instance có giống nhau không
        System.out.println("Logger1: "+ logger1);
        System.out.println("Logger2: "+ logger2);
        System.out.println("Logger1 == Logger2? " + (logger1 == logger2));

        // // 1b.Ví dụ sử dụng Factory Method
        // //- Tách biệt quá trình tạo đối tượng khỏi việc sử dụng đối tượng.
        // //  Điều này giúp cho client không cần phải biết chi tiết cách khởi tạo hay lớp cụ thể nào đang được tạo ra.

        // //- Giảm sự phụ thuộc: Client chỉ cần biết giao diện chung (ví dụ: PaymentStrategy)
        // //  mà không cần quan tâm đến cách cài đặt cụ thể của từng phương thức thanh toán.
        // //- Khi cần thêm phương thức thanh toán mới, chỉ cần tạo lớp mới và cập nhật Factory,
        // //  không ảnh hưởng đến phần code sử dụng Factory.

        // // PaymentFactory kiểm tra tham số truyền vào và tạo ra đối tượng tương ứng (như CashPayment,
        // // BankTransferPayment, MomoPayment, hoặc VNPayPayment). Điều này cho phép bạn mở rộng hệ
        // // thống thanh toán một cách linh hoạt mà không cần thay đổi mã nguồn của client.
        // PaymentStrategy payment = PaymentFactory.getPaymentMethod("momo");
        // payment.pay(1500);

        // 2. Strategy Pattern
        //- Tách biệt thuật toán (chiến lược) khỏi đối tượng sử dụng chúng.
        //- Cho phép thay đổi hành vi của đối tượng một cách linh hoạt tại thời điểm chạy.
        //- Giảm sự phụ thuộc: Đối tượng sử dụng (Context) không cần biết chi tiết về cách cài đặt của từng thuật toán.
        //- Dễ dàng mở rộng: Khi cần thêm thuật toán mới, chỉ cần tạo lớp mới và không ảnh hưởng đến code hiện có.
          // --- KIỂM THỬ CÂU 1 (SINGLETON) ---
        System.out.println("=== CÂU 1: SINGLETON PATTERN ===");
        DatabaseConnection conn1 = DatabaseConnection.getInstance();
        DatabaseConnection conn2 = DatabaseConnection.getInstance();
        
        conn1.executeQuery("SELECT * FROM Tau");

        System.out.println("conn1: "+ conn1 + " \nconn2: "+ conn2);
         System.out.println("Kiểm chứng: conn1 và conn2 là cùng 1 instance! (Thành công)");

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