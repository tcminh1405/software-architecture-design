package iuh.fit.se.serviceconsumer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class ServiceConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceConsumerApplication.class, args);
        
        System.out.println("========================================");
        System.out.println("   SERVICE CONSUMER - CHAT CONSOLE");
        System.out.println("========================================");
        System.out.println("Đang lắng nghe tin nhắn từ Redis...");
        System.out.println("(Nhấn Ctrl+C để dừng)");
        System.out.println("----------------------------------------\n");
        System.out.print(">>> Đang chờ tin nhắn... ");
    }

}
