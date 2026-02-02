package iuh.fit.se.strategy;

/**
 * Thuế giá trị gia tăng (VAT) - 10%
 */
public class VATTax implements TaxStrategy {
    @Override
    public double calculateTax(double price) {
        return price * 0.10;
    }

    @Override
    public String getTaxName() {
        return "Thuế VAT (10%)";
    }
}
