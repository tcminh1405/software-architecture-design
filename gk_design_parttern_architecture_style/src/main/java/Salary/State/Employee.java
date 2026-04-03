package Salary.State;

// Employee.java
public class Employee {
    private double baseSalary;
    private SalaryState state;

    public Employee(double baseSalary, SalaryState state) {
        this.baseSalary = baseSalary;
        this.state = state;
    }
    public void setState(SalaryState state) {
        this.state = state;
    }
    public void calculateSalary() {
        double salary = state.calculateSalary(baseSalary);
        System.out.println("Nhân viên (" + state.getRole() + ") có lương: " + salary);
    }
}
