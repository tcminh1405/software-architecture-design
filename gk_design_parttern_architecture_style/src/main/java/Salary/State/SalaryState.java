package Salary.State;

// SalaryState.java
public interface SalaryState {
    double calculateSalary(double baseSalary);
    String getRole();
    // Phương thức chuyển trạng thái (nếu cần)
    void next(Employee employee);
}
