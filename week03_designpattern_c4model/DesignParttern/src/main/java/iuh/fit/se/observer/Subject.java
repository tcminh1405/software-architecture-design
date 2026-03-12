package iuh.fit.se.observer;

/**
 * Subject interface - Giao diện cho các đối tượng phát sự kiện.
 */
public interface Subject {
    void registerObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
}
