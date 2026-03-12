package iuh.fit.se.observer;

/**
 * Observer interface - Giao diện chung cho tất cả observer.
 *
 * UML (Observer Pattern):
 *
 *  +------------+         +------------------+
 *  |  Subject   |<>------>|    Observer      |
 *  | <<interface>>|       | <<interface>>    |
 *  |------------|         |------------------|
 *  |+register() |         |+update(data:Str) |
 *  |+remove()   |         +------------------+
 *  |+notify()   |              /\       /\
 *  +------------+              |         |
 *       /\    /\           Investor  TeamMember
 *       |      |
 * StockMarket  TaskBoard
 */
public interface Observer {
    void update(String eventData);
}
