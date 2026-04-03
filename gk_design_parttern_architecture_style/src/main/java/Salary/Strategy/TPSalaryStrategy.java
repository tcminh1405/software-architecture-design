package Salary.Strategy;

// TPSalaryStrategy.java
public class TPSalaryStrategy implements SalaryStrategy {
    private double allowance;
    public TPSalaryStrategy(double allowance) {
        this.allowance = allowance;
    }
    public double calculateSalary(double baseSalary) {
        return baseSalary + allowance;
    }
    public String getRole() { return "Trưởng Phòng (TP)"; }
}
