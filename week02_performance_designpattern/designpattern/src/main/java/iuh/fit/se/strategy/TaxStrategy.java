package iuh.fit.se.strategy;

/**
 * Interface chiến lược tính thuế
 * STRATEGY PATTERN - Bài 2: Tính thuế sản phẩm
 */
public interface TaxStrategy {
    double calculateTax(double price);
    String getTaxName();
}
