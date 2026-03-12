package iuh.fit.se.observer;

/**
 * Concrete Observer - Nhà đầu tư theo dõi cổ phiếu.
 */
public class Investor implements Observer {

    private final String name;

    public Investor(String name) { this.name = name; }

    @Override
    public void update(String eventData) {
        System.out.println("  🔔 [Nhà đầu tư: " + name + "] Nhận thông báo: " + eventData);
    }
}
