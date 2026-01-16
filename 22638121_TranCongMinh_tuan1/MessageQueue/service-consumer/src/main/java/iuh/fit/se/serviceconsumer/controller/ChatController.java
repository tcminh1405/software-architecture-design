package iuh.fit.se.serviceconsumer.controller;

import iuh.fit.se.serviceconsumer.model.Message;
import iuh.fit.se.serviceconsumer.service.MessageListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {
    
    private final MessageListener messageListener;
    
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages() {
        List<Message> messages = messageListener.getAllMessages();
        log.info("=== SERVICE CONSUMER ===");
        log.info("Yêu cầu lấy danh sách tin nhắn - Tổng số: {}", messages.size());
        messages.forEach(msg -> 
            log.info("  - {}: {} (lúc {})", 
                msg.getSender(), 
                msg.getContent(), 
                msg.getTimestamp())
        );
        log.info("========================");
        return ResponseEntity.ok(messages);
    }
    
    @DeleteMapping("/messages")
    public ResponseEntity<String> clearMessages() {
        messageListener.clearMessages();
        log.info("=== SERVICE CONSUMER ===");
        log.info("Đã xóa tất cả tin nhắn");
        log.info("========================");
        return ResponseEntity.ok("Đã xóa tất cả tin nhắn");
    }
    
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        int messageCount = messageListener.getAllMessages().size();
        return ResponseEntity.ok(String.format(
            "Service Consumer đang chạy - Đã nhận %d tin nhắn", messageCount));
    }
}
