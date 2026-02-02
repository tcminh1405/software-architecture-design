package iuh.fit.se.state;

/**
 * Demo State Pattern - Bài 1: Quản lý đơn hàng
 */
public class StateDemo {
    public static void main(String[] args) {

        System.out.println("   BÀI 1: STATE PATTERN - QUẢN LÝ ĐƠN HÀNG       ");


        // Đơn hàng 1: Xử lý bình thường
        System.out.println("\n--- Đơn hàng 1: Xử lý bình thường ---");
        Order order1 = new Order("DH001");
        order1.process(); // Mới tạo → Đang xử lý
        order1.process(); // Đang xử lý → Đã giao
        order1.process(); // Đã giao

        // Đơn hàng 2: Hủy
        System.out.println("\n--- Đơn hàng 2: Hủy đơn hàng ---");
        Order order2 = new Order("DH002");
        order2.process(); // Mới tạo → Đang xử lý
        order2.cancel();  // Hủy và hoàn tiền

        // Kết luận
        System.out.println("\n╔══════════════════════════════════════════════════╗");
        System.out.println("║                    KẾT LUẬN                      ║");
        System.out.println("╠══════════════════════════════════════════════════╣");
        System.out.println("║ State Pattern cho phép đối tượng thay đổi hành   ║");
        System.out.println("║ vi khi trạng thái thay đổi.                      ║");
        System.out.println("║                                                  ║");
        System.out.println("║ Ưu điểm:                                         ║");
        System.out.println("║ - Tránh dùng if-else/switch-case phức tạp       ║");
        System.out.println("║ - Dễ thêm trạng thái mới                         ║");
        System.out.println("║ - Tuân thủ nguyên tắc Open/Closed               ║");
        System.out.println("╚══════════════════════════════════════════════════╝");
    }
}
