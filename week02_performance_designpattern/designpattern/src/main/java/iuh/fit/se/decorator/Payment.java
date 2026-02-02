package iuh.fit.se.decorator;

/**
 * Interface thanh toán
 * DECORATOR PATTERN - Bài 3: Hệ thống thanh toán
 */
public interface Payment {
    double getAmount();
    String getDescription();
    void processPayment();
}
