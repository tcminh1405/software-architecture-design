package Salary.Decorator;

// SalaryDecorator.java
public abstract class SalaryDecorator implements SalaryComponent {
    protected SalaryComponent salaryComponent;
    public SalaryDecorator(SalaryComponent salaryComponent) {
        this.salaryComponent = salaryComponent;
    }
    public double getSalary() {
        return salaryComponent.getSalary();
    }
}
