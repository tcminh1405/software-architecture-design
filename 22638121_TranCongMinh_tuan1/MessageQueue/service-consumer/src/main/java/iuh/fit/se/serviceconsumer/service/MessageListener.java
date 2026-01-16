package iuh.fit.se.serviceconsumer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.serviceconsumer.model.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message as RedisMessage;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageListener implements org.springframework.data.redis.connection.MessageListener {
    
    private final List<Message> messages = new CopyOnWriteArrayList<>();
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public void onMessage(RedisMessage redisMessage, byte[] pattern) {
        try {
            GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer();
            Object deserialized = serializer.deserialize(redisMessage.getBody());
            
            if (deserialized instanceof Message) {
                Message message = (Message) deserialized;
                messages.add(message);
                log.info("Received and stored message from {}: {}", message.getSender(), message.getContent());
            } else {
                log.warn("Received message is not of type Message: {}", deserialized);
            }
        } catch (Exception e) {
            log.error("Error processing message", e);
        }
    }
    
    public List<Message> getAllMessages() {
        return new ArrayList<>(messages);
    }
    
    public void clearMessages() {
        messages.clear();
    }
}
