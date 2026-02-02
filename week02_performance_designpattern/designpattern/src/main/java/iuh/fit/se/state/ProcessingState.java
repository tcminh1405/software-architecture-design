package iuh.fit.se.state;

/**
 * Trạng thái ĐANG XỬ LÝ
 * Hành vi: Đóng gói và vận chuyển
 */
public class ProcessingState implements OrderState {
    @Override
    public void handle(Order order) {
        System.out.println("  → Đóng gói đơn hàng...");
        System.out.println("  → Vận chuyển đơn hàng...");
        System.out.println("  → Chuyển sang trạng thái Đã giao.");
        order.setState(new DeliveredState());
    }

    @Override
    public String getStateName() {
        return "Đang xử lý";
    }
}
