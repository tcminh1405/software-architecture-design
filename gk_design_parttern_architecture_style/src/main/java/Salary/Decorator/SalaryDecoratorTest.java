package Salary.Decorator;

// SalaryDecoratorTest.java (Main)
public class SalaryDecoratorTest {
    public static void main(String[] args) {
        SalaryComponent basicSalary = new BasicEmployeeSalary(5000);
        SalaryComponent tpSalary = new TPSalaryDecorator(basicSalary, 1500);
        System.out.println("Nhân viên (Trưởng Phòng) có lương: " + tpSalary.getSalary());
    }
}
