package iuh.fit.se.state;

/**
 * Trạng thái HỦY
 * Hành vi: Hủy đơn hàng và hoàn tiền
 */
public class CancelledState implements OrderState {
    @Override
    public void handle(Order order) {
        System.out.println("  → Hủy đơn hàng...");
        System.out.println("  → Hoàn tiền cho khách hàng.");
    }

    @Override
    public String getStateName() {
        return "Hủy";
    }
}
