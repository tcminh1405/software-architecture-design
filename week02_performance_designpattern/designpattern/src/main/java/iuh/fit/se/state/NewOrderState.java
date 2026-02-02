package iuh.fit.se.state;

/**
 * Trạng thái MỚI TẠO
 * Hành vi: Kiểm tra thông tin đơn hàng
 */
public class NewOrderState implements OrderState {
    @Override
    public void handle(Order order) {
        System.out.println("  → Kiểm tra thông tin đơn hàng...");
        System.out.println("  → Thông tin hợp lệ. Chuyển sang trạng thái Đang xử lý.");
        order.setState(new ProcessingState());
    }

    @Override
    public String getStateName() {
        return "Mới tạo";
    }
}
