package iuh.fit.se.serviceproducer.controller;

import iuh.fit.se.serviceproducer.model.Message;
import iuh.fit.se.serviceproducer.service.MessagePublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {
    
    private final MessagePublisher messagePublisher;
    
    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        message.setTimestamp(LocalDateTime.now());
        log.info("=== SERVICE PRODUCER ===");
        log.info("Nhận tin nhắn từ người dùng:");
        log.info("Người gửi: {}", message.getSender());
        log.info("Nội dung: {}", message.getContent());
        log.info("Thời gian: {}", message.getTimestamp());
        
        messagePublisher.publish(message);
        
        log.info("Đã publish tin nhắn vào Redis channel: chat:messages");
        log.info("========================");
        
        return ResponseEntity.ok(message);
    }
    
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("Service Producer đang chạy - Sẵn sàng nhận tin nhắn!");
    }
}
