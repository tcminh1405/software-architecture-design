package iuh.fit.se.strategy;

/**
 * Thuế xa xỉ phẩm - 30%
 */
public class LuxuryTax implements TaxStrategy {
    @Override
    public double calculateTax(double price) {
        return price * 0.30;
    }

    @Override
    public String getTaxName() {
        return "Thuế xa xỉ phẩm (30%)";
    }
}
