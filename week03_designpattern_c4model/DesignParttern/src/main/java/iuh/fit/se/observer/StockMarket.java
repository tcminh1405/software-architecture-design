package iuh.fit.se.observer;

import java.util.ArrayList;
import java.util.List;

/**
 * Concrete Subject - Thị trường cổ phiếu.
 * Thông báo cho tất cả nhà đầu tư khi giá thay đổi.
 */
public class StockMarket implements Subject {

    private final String stockName;
    private double price;
    private final List<Observer> observers = new ArrayList<>();

    public StockMarket(String stockName, double initialPrice) {
        this.stockName = stockName;
        this.price = initialPrice;
        System.out.println("[StockMarket] Khởi tạo cổ phiếu \"" + stockName
                + "\" giá ban đầu: " + initialPrice + " VNĐ");
    }

    public void setPrice(double newPrice) {
        double oldPrice = this.price;
        this.price = newPrice;
        String trend = (newPrice > oldPrice) ? "▲ TĂNG" : "▼ GIẢM";
        System.out.println("\n[StockMarket] " + stockName + " " + trend
                + ": " + oldPrice + " → " + newPrice + " VNĐ");
        notifyObservers();
    }

    @Override
    public void registerObserver(Observer observer) { observers.add(observer); }

    @Override
    public void removeObserver(Observer observer) { observers.remove(observer); }

    @Override
    public void notifyObservers() {
        String data = "Cổ phiếu [" + stockName + "] = " + price + " VNĐ";
        for (Observer o : observers) o.update(data);
    }
}
