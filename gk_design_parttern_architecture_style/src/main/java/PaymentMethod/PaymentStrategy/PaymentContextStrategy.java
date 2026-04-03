package PaymentMethod.PaymentStrategy;

// PaymentContextStrategy.java
public class PaymentContextStrategy {
    private PaymentStrategy strategy;
    public PaymentContextStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }
    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }
    public void executePayment(double amount) {
        strategy.pay(amount);
    }
}
