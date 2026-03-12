package iuh.fit.se;

import iuh.fit.se.composite.CompositeDemo;
import iuh.fit.se.observer.ObserverDemo;
import iuh.fit.se.adapter.AdapterDemo;

/**
 * Main class - Chạy demo toàn bộ 3 Design Pattern:
 *   1. Composite Pattern  - Quản lý thư mục & tập tin
 *   2. Observer Pattern   - Thông báo cổ phiếu & task
 *   3. Adapter Pattern    - Chuyển đổi XML ↔ JSON
 */
public class Main {
    public static void main(String[] args) {
        CompositeDemo.run();
        ObserverDemo.run();
        AdapterDemo.run();
    }
}