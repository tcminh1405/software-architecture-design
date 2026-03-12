package iuh.fit.se.composite;

/**
 * Component - Giao diện chung cho cả File và Directory.
 *
 * UML (Composite Pattern):
 *
 *  +------------------------+
 *  |  FileSystemComponent   |  <<interface>>
 *  +------------------------+
 *  | +getName(): String     |
 *  | +getSize(): long       |
 *  | +display(indent:String)|
 *  +------------------------+
 *         /\        /\
 *         |          |
 *  +------+---+  +---+--------+
 *  |   File   |  | Directory  |
 *  +----------+  +------------+
 *  | -name    |  | -name      |
 *  | -size    |  | -children  |
 *  +----------+  +------------+
 *  (Leaf)         (Composite)
 */
public interface FileSystemComponent {
    String getName();
    long getSize();
    void display(String indent);
}
