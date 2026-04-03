package FactoryPattern;

// PaymentFactory.java: Factory Method để tạo đối tượng theo loại thanh toán
public class PaymentFactory {
    public static PaymentStrategy getPaymentMethod(String type) {
        if (type.equalsIgnoreCase("cash")) {
            return new CashPayment();
        } else if (type.equalsIgnoreCase("banktransfer")) {
            return new BankTransferPayment();
        } else if (type.equalsIgnoreCase("momo")) {
            return new MomoPayment();
        } else if (type.equalsIgnoreCase("vnpay")) {
            return new VNPayPayment();
        } else {
            throw new IllegalArgumentException("Unknown payment type: " + type);
        }
    }
}
