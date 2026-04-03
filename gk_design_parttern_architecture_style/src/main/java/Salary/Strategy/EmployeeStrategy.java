package Salary.Strategy;

// EmployeeStrategy.java
public class EmployeeStrategy {
    private double baseSalary;
    private SalaryStrategy strategy;

    public EmployeeStrategy(double baseSalary, SalaryStrategy strategy) {
        this.baseSalary = baseSalary;
        this.strategy = strategy;
    }
    public void setStrategy(SalaryStrategy strategy) {
        this.strategy = strategy;
    }
    public void calculateSalary() {
        double salary = strategy.calculateSalary(baseSalary);
        System.out.println("Nhân viên (" + strategy.getRole() + ") có lương: " + salary);
    }
}
