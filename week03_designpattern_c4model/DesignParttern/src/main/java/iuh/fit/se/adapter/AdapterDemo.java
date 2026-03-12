package iuh.fit.se.adapter;

/**
 * Demo Adapter Pattern - Chuyển đổi XML ↔ JSON.
 *
 * Vấn đề  : Web client chỉ nói JSON, hệ thống cũ chỉ hiểu XML.
 * Giải pháp: XmlToJsonAdapter bọc XmlSystem vào JsonService interface.
 */
public class AdapterDemo {

    /** Chạy riêng Adapter Pattern demo */
    public static void main(String[] args) {
        run();
    }


    public static void run() {
        System.out.println("=================================================");
        System.out.println("   ADAPTER PATTERN - Chuyển đổi XML ↔ JSON");
        System.out.println("=================================================");

        XmlSystem       xmlSystem = new XmlSystem();
        JsonService     adapter   = new XmlToJsonAdapter(xmlSystem);
        WebServiceClient client   = new WebServiceClient(adapter);

        System.out.println("\n[System] Khởi tạo:");
        System.out.println("  • XmlSystem       → hệ thống legacy, chỉ hiểu XML");
        System.out.println("  • XmlToJsonAdapter → cầu nối XML ↔ JSON");
        System.out.println("  • WebServiceClient → chỉ biết JsonService interface\n");

        System.out.println("── Request 1 ─────────────────────────────────");
        client.sendData("{ \"key\": \"username\", \"value\": \"NguyenVanA\" }");

        System.out.println("\n── Request 2 ─────────────────────────────────");
        client.sendData("{ \"key\": \"product\", \"value\": \"Laptop Dell\" }");

        System.out.println("\n>>> Client hoàn toàn không biết XmlSystem tồn tại.");
        System.out.println("    Adapter chuyển đổi trong suốt — JSON vào, JSON ra!\n");
    }
}
