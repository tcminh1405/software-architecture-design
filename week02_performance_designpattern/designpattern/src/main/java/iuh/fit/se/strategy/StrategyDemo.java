package iuh.fit.se.strategy;

/**
 * Demo Strategy Pattern - Bài 2: Tính thuế sản phẩm
 */
public class StrategyDemo {
    public static void main(String[] args) {

        System.out.println("   BÀI 2: STRATEGY PATTERN - TÍNH THUẾ SẢN PHẨM  ");


        // Sản phẩm thông thường - VAT
        System.out.println("\n--- Sản phẩm thông thường (VAT 10%) ---");
        Product laptop = new Product("Laptop", 20000000, new VATTax());
        laptop.displayInfo();

        // Sản phẩm đặc biệt - Thuế tiêu thụ
        System.out.println("\n--- Sản phẩm đặc biệt (Thuế tiêu thụ 20%) ---");
        Product beer = new Product("Bia", 500000, new ConsumptionTax());
        beer.displayInfo();

        // Sản phẩm xa xỉ - Thuế xa xỉ
        System.out.println("\n--- Sản phẩm xa xỉ (Thuế xa xỉ 30%) ---");
        Product rolex = new Product("Đồng hồ Rolex", 100000000, new LuxuryTax());
        rolex.displayInfo();

        // Thay đổi chiến lược thuế
        System.out.println("\n--- Thay đổi thuế: Laptop áp dụng thuế xa xỉ ---");
        laptop.setTaxStrategy(new LuxuryTax());
        laptop.displayInfo();

        // Kết luận
        System.out.println("\n╔══════════════════════════════════════════════════╗");
        System.out.println("║                    KẾT LUẬN                      ║");
        System.out.println("╠══════════════════════════════════════════════════╣");
        System.out.println("║ Strategy Pattern cho phép thay đổi thuật toán    ║");
        System.out.println("║ tính thuế tại runtime.                           ║");
        System.out.println("║                                                  ║");
        System.out.println("║ Ưu điểm:                                         ║");
        System.out.println("║ - Dễ thêm loại thuế mới                          ║");
        System.out.println("║ - Thay đổi thuế linh hoạt                        ║");
        System.out.println("║ - Tách biệt logic tính thuế khỏi Product         ║");
        System.out.println("╚══════════════════════════════════════════════════╝");
    }
}
