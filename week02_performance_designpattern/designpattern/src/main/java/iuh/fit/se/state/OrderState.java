package iuh.fit.se.state;

/**
 * Interface định nghĩa trạng thái đơn hàng
 * STATE PATTERN - Bài 1: Quản lý đơn hàng
 */
public interface OrderState {
    void handle(Order order);
    String getStateName();
}
