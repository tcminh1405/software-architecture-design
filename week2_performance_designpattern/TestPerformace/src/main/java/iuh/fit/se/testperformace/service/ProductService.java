package iuh.fit.se.testperformace.service;

import iuh.fit.se.testperformace.model.Product;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

//    @Cacheable(value = "products", key = "#id")
    public Product getProductById(String id) {
        // Giả lập gọi DB chậm
        try {
            System.out.println("Đang ngủ 2 giây...");
            Thread.sleep(2000); // Delay 2 giây
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return new Product(id, "Sản phẩm " + id, 50000.0, "Mô tả sản phẩm " + id);
    }
}
