package Salary.Decorator;

// TPSalaryDecorator.java
public class TPSalaryDecorator extends SalaryDecorator {
    private double allowance;
    public TPSalaryDecorator(SalaryComponent salaryComponent, double allowance) {
        super(salaryComponent);
        this.allowance = allowance;
    }
    public double getSalary() {
        return super.getSalary() + allowance;
    }
}
