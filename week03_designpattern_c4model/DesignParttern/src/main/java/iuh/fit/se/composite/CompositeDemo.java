package iuh.fit.se.composite;

/**
 * Demo Composite Pattern - Quản lý Thư mục & Tập tin.
 *
 * Cấu trúc cây:
 *  root/
 *  ├── readme.txt            (500 bytes)
 *  ├── src/
 *  │   ├── main.java         (1200 bytes)
 *  │   ├── utils.java        (800 bytes)
 *  │   └── config/
 *  │       └── app.properties (300 bytes)
 *  └── docs/
 *      ├── design.pdf        (5120 bytes)
 *      └── notes.txt         (256 bytes)
 */
public class CompositeDemo {

    /** Chạy riêng Composite Pattern demo */
    public static void main(String[] args) {
        run();
    }


    public static void run() {
        System.out.println("=================================================");
        System.out.println("  COMPOSITE PATTERN - Quản lý Thư mục & Tập tin");
        System.out.println("=================================================");

        // Tập tin lá (Leaf)
        File readme    = new File("readme.txt",       500);
        File mainJava  = new File("main.java",       1200);
        File utilsJava = new File("utils.java",       800);
        File appProp   = new File("app.properties",   300);
        File designPdf = new File("design.pdf",      5120);
        File notesTxt  = new File("notes.txt",        256);

        // Thư mục config
        Directory config = new Directory("config");
        config.add(appProp);

        // Thư mục src
        Directory src = new Directory("src");
        src.add(mainJava);
        src.add(utilsJava);
        src.add(config);

        // Thư mục docs
        Directory docs = new Directory("docs");
        docs.add(designPdf);
        docs.add(notesTxt);

        // Thư mục gốc
        Directory root = new Directory("root");
        root.add(readme);
        root.add(src);
        root.add(docs);

        System.out.println("\n📂 Cấu trúc cây thư mục:\n");
        root.display("");

        System.out.println();
        System.out.println("── Thống kê ──────────────────────────────────");
        System.out.println("Tổng kích thước root  : " + root.getSize() + " bytes");
        System.out.println("Tổng kích thước src   : " + src.getSize()  + " bytes");
        System.out.println("Tổng kích thước docs  : " + docs.getSize() + " bytes");
        System.out.println("Kích thước readme.txt : " + readme.getSize() + " bytes");
        System.out.println("\n>>> Client gọi display() và getSize() giống nhau");
        System.out.println("    cho cả File lẫn Directory — đây là sức mạnh của Composite Pattern!\n");
    }
}
