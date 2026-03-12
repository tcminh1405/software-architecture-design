package iuh.fit.se.observer;

/**
 * Concrete Observer - Thành viên nhóm theo dõi trạng thái task.
 */
public class TeamMember implements Observer {

    private final String name;

    public TeamMember(String name) { this.name = name; }

    @Override
    public void update(String eventData) {
        System.out.println("  📩 [Thành viên: " + name + "] Nhận thông báo: " + eventData);
    }
}
