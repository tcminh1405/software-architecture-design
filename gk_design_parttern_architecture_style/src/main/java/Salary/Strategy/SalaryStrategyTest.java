package Salary.Strategy;

// SalaryStrategyTest.java (Main)
public class SalaryStrategyTest {
    public static void main(String[] args) {
        EmployeeStrategy nv1 = new EmployeeStrategy(5000, new TPSalaryStrategy(1500));
        nv1.calculateSalary();
    }
}
