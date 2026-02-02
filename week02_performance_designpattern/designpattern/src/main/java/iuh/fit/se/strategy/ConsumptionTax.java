package iuh.fit.se.strategy;

/**
 * Thuế tiêu thụ đặc biệt - 20%
 */
public class ConsumptionTax implements TaxStrategy {
    @Override
    public double calculateTax(double price) {
        return price * 0.20;
    }

    @Override
    public String getTaxName() {
        return "Thuế tiêu thụ đặc biệt (20%)";
    }
}
