package PaymentMethod.PaymentDecorator;

// PaymentDecoratorTest.java (Main)
public class PaymentDecoratorTest {
    public static void main(String[] args) {
        Payment basicPayment = new BasicPayment();

        Payment cashPayment = new CashPaymentDecorator(basicPayment);
        cashPayment.pay(1000);

        Payment bankTransfer = new BankTransferPaymentDecorator(basicPayment);
        bankTransfer.pay(2000);

        Payment momoPayment = new MomoPaymentDecorator(basicPayment);
        momoPayment.pay(3000);

        Payment vnpayPayment = new VNPayPaymentDecorator(basicPayment);
        vnpayPayment.pay(4000);
    }
}
