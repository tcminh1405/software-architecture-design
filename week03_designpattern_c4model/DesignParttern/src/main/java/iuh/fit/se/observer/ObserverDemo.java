package iuh.fit.se.observer;

/**
 * Demo Observer Pattern - 2 kịch bản:
 *  1) Thị trường cổ phiếu → Nhà đầu tư
 *  2) Quản lý Task → Thành viên nhóm
 */
public class ObserverDemo {

    /** Chạy riêng Observer Pattern demo */
    public static void main(String[] args) {
        run();
    }


    public static void run() {
        System.out.println("=================================================");
        System.out.println("     OBSERVER PATTERN - Thông báo sự kiện");
        System.out.println("=================================================");

        // ── Kịch bản 1: Cổ phiếu ──────────────────────────
        System.out.println("\n╔══════════════════════════════════════╗");
        System.out.println("║  Kịch bản 1: Thị trường Cổ phiếu    ║");
        System.out.println("╚══════════════════════════════════════╝\n");

        StockMarket vcb = new StockMarket("VCB", 85_000.0);

        Investor a = new Investor("Nguyễn Văn A");
        Investor b = new Investor("Trần Thị B");
        Investor c = new Investor("Lê Văn C");

        vcb.registerObserver(a);
        vcb.registerObserver(b);
        vcb.registerObserver(c);
        System.out.println("[System] 3 nhà đầu tư đã đăng ký theo dõi VCB.");

        vcb.setPrice(87_000.0);   // A, B, C nhận thông báo
        vcb.setPrice(83_500.0);

        System.out.println("\n[System] Trần Thị B hủy theo dõi.");
        vcb.removeObserver(b);
        vcb.setPrice(90_000.0);   // chỉ A, C nhận thông báo

        // ── Kịch bản 2: Task ───────────────────────────────
        System.out.println("\n╔══════════════════════════════════════╗");
        System.out.println("║  Kịch bản 2: Quản lý Task dự án     ║");
        System.out.println("╚══════════════════════════════════════╝\n");

        TaskBoard task = new TaskBoard("Thiết kế database", "TODO");

        TeamMember pm    = new TeamMember("Minh (PM)");
        TeamMember dev   = new TeamMember("Hùng (Dev)");
        TeamMember tester= new TeamMember("Lan (Tester)");

        task.registerObserver(pm);
        task.registerObserver(dev);
        task.registerObserver(tester);
        System.out.println("[System] 3 thành viên đã đăng ký theo dõi task.");

        task.setStatus("IN_PROGRESS");
        task.setStatus("REVIEW");
        task.setStatus("DONE");

        System.out.println("\n>>> Subject không cần biết Observer là ai — chỉ gọi notifyObservers()!\n");
    }
}
