package iuh.fit.se.observer;

import java.util.ArrayList;
import java.util.List;

/**
 * Concrete Subject - Bảng quản lý trạng thái Task dự án.
 * Thông báo cho tất cả thành viên khi trạng thái task thay đổi.
 */
public class TaskBoard implements Subject {

    private final String taskName;
    private String status;
    private final List<Observer> observers = new ArrayList<>();

    public TaskBoard(String taskName, String initialStatus) {
        this.taskName = taskName;
        this.status = initialStatus;
        System.out.println("[TaskBoard] Tạo task \"" + taskName
                + "\" trạng thái ban đầu: [" + initialStatus + "]");
    }

    public void setStatus(String newStatus) {
        String old = this.status;
        this.status = newStatus;
        System.out.println("\n[TaskBoard] Task \"" + taskName
                + "\": [" + old + "] → [" + newStatus + "]");
        notifyObservers();
    }

    @Override
    public void registerObserver(Observer observer) { observers.add(observer); }

    @Override
    public void removeObserver(Observer observer) { observers.remove(observer); }

    @Override
    public void notifyObservers() {
        String data = "Task [" + taskName + "] cập nhật trạng thái: " + status;
        for (Observer o : observers) o.update(data);
    }
}
