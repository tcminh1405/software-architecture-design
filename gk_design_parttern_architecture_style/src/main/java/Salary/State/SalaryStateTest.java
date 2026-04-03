package Salary.State;

// SalaryStateTest.java (Main)
public class SalaryStateTest {
    public static void main(String[] args) {
        Employee nv1 = new Employee(5000, new TPState(1500));
        nv1.calculateSalary(); // In ra: 5000 + 1500
    }
}
