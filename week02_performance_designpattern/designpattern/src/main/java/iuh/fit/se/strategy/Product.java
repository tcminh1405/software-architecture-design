package iuh.fit.se.strategy;

/**
 * Product - Context sử dụng TaxStrategy
 */
public class Product {
    private String name;
    private double price;
    private TaxStrategy taxStrategy;

    public Product(String name, double price, TaxStrategy taxStrategy) {
        this.name = name;
        this.price = price;
        this.taxStrategy = taxStrategy;
    }

    public void setTaxStrategy(TaxStrategy taxStrategy) {
        this.taxStrategy = taxStrategy;
    }

    public double calculateTax() {
        return taxStrategy.calculateTax(price);
    }

    public double getTotalPrice() {
        return price + calculateTax();
    }

    public void displayInfo() {
        System.out.println("Sản phẩm: " + name);
        System.out.println("  Giá gốc: " + String.format("%,.0f", price) + " VND");
        System.out.println("  Loại thuế: " + taxStrategy.getTaxName());
        System.out.println("  Thuế: " + String.format("%,.0f", calculateTax()) + " VND");
        System.out.println("  Tổng tiền: " + String.format("%,.0f", getTotalPrice()) + " VND");
    }
}
