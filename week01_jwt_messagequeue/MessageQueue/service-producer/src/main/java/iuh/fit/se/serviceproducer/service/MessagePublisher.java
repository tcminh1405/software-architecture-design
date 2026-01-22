package iuh.fit.se.serviceproducer.service;

import iuh.fit.se.serviceproducer.model.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessagePublisher {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic topic;
    
    public void publish(String sender, String content) {
        Message message = new Message(
            sender,
            content,
            LocalDateTime.now()
        );
        
        redisTemplate.convertAndSend(topic.getTopic(), message);
        log.info("[{}] {}: {}", message.getTimestamp(), message.getSender(), message.getContent());
    }
}
