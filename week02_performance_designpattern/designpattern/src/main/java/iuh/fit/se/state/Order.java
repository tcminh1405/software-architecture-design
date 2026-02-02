package iuh.fit.se.state;

/**
 * Order - Context trong State Pattern
 */
public class Order {
    private OrderState state;
    private String orderId;

    public Order(String orderId) {
        this.orderId = orderId;
        this.state = new NewOrderState();
    }

    public void setState(OrderState state) {
        this.state = state;
    }

    public void process() {
        System.out.println("\n[Đơn hàng " + orderId + " - Trạng thái: " + state.getStateName() + "]");
        state.handle(this);
    }

    public void cancel() {
        System.out.println("\n[Đơn hàng " + orderId + " - Yêu cầu hủy]");
        this.state = new CancelledState();
        state.handle(this);
    }
}
