package Salary.Decorator;

// BasicEmployeeSalary.java
public class BasicEmployeeSalary implements SalaryComponent {
    private double baseSalary;
    public BasicEmployeeSalary(double baseSalary) {
        this.baseSalary = baseSalary;
    }
    public double getSalary() {
        return baseSalary;
    }
}
