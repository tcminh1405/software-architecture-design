package iuh.fit.se.composite;

import java.util.ArrayList;
import java.util.List;

/**
 * Composite - Thư mục (nút nhánh).
 * Có thể chứa File hoặc Directory con.
 */
public class Directory implements FileSystemComponent {

    private final String name;
    private final List<FileSystemComponent> children = new ArrayList<>();

    public Directory(String name) {
        this.name = name;
    }

    public void add(FileSystemComponent component) {
        children.add(component);
    }

    public void remove(FileSystemComponent component) {
        children.remove(component);
    }

    @Override
    public String getName() { return name; }

    /** Tổng kích thước = tổng kích thước của tất cả con (đệ quy) */
    @Override
    public long getSize() {
        long total = 0;
        for (FileSystemComponent child : children) {
            total += child.getSize();
        }
        return total;
    }

    /** Hiển thị cây thư mục đệ quy */
    @Override
    public void display(String indent) {
        System.out.println(indent + "📁 " + name + "/  (tổng: " + getSize() + " bytes)");
        for (FileSystemComponent child : children) {
            child.display(indent + "    ");
        }
    }
}
