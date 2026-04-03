package SingletonPattern;

// DatabaseConnection.java - Câu 1 (Singleton)
public class DatabaseConnection {
    // 1. Biến static duy nhất chứa instance của class
    private static DatabaseConnection instance;

    // 2. Private constructor để ngăn chặn việc tạo đối tượng từ bên ngoài
    private DatabaseConnection() {
        System.out.println("Đang khởi tạo kết nối Database duy nhất...");
    }

    // 3. Phương thức static để lấy instance duy nhất
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    public void executeQuery(String sql) {
        System.out.println("Đang thực thi truy vấn: " + sql);
    }
}
