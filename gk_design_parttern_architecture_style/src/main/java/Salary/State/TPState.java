package Salary.State;

// TPState.java (Trưởng Phòng)
public class TPState implements SalaryState {
    private double allowance;
    public TPState(double allowance) {
        this.allowance = allowance;
    }
    public double calculateSalary(double baseSalary) {
        return baseSalary + allowance;
    }
    public String getRole() { return "Trưởng Phòng (TP)"; }
    public void next(Employee employee) {
        // Ví dụ: không chuyển sang trạng thái khác
    }
}
