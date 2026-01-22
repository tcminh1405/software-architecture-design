package iuh.fit.se.serviceproducer;

import iuh.fit.se.serviceproducer.service.MessagePublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Scanner;

@SpringBootApplication
@RequiredArgsConstructor
@Slf4j
public class ServiceProducerApplication implements CommandLineRunner {
    
    private final MessagePublisher messagePublisher;
    
    public static void main(String[] args) {
        SpringApplication.run(ServiceProducerApplication.class, args);
    }
    
    @Override
    public void run(String... args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("========================================");
        System.out.println("   SERVICE PRODUCER - CHAT CONSOLE");
        System.out.println("========================================");
        System.out.print("Nhập tên của bạn: ");
        String sender = scanner.nextLine().trim();
        
        if (sender.isEmpty()) {
            sender = "User" + System.currentTimeMillis() % 1000;
        }
        
        System.out.println("\nBắt đầu chat! (Gõ 'exit' để thoát)");
        System.out.println("Bạn là: " + sender);
        System.out.println("----------------------------------------\n");
        
        while (true) {
            System.out.print("[" + sender + "]: ");
            String content = scanner.nextLine().trim();
            
            if (content.isEmpty()) {
                continue;
            }
            
            if ("exit".equalsIgnoreCase(content)) {
                System.out.println("Đã thoát chat!");
                break;
            }
            
            messagePublisher.publish(sender, content);
        }
        
        scanner.close();
        System.exit(0);
    }
}
