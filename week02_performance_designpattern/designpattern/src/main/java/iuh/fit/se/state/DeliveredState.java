package iuh.fit.se.state;

/**
 * Trạng thái ĐÃ GIAO
 * Hành vi: Cập nhật trạng thái đơn hàng là đã giao
 */
public class DeliveredState implements OrderState {
    @Override
    public void handle(Order order) {
        System.out.println("  → Đơn hàng đã giao thành công!");
        System.out.println("  → Cập nhật trạng thái hoàn thành.");
    }

    @Override
    public String getStateName() {
        return "Đã giao";
    }
}
