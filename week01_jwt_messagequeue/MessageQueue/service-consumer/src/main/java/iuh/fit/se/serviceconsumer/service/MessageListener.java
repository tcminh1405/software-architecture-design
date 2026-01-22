package iuh.fit.se.serviceconsumer.service;

import iuh.fit.se.serviceconsumer.model.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message as RedisMessage;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageListener implements org.springframework.data.redis.connection.MessageListener {
    
    @Override
    public void onMessage(RedisMessage redisMessage, byte[] pattern) {
        try {
            GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer();
            Object deserialized = serializer.deserialize(redisMessage.getBody());
            
            if (deserialized instanceof Message) {
                Message message = (Message) deserialized;
                System.out.println("\n>>> Nhận tin nhắn mới:");
                System.out.println("    [" + message.getTimestamp() + "] " + message.getSender() + ": " + message.getContent());
                System.out.print(">>> Đang chờ tin nhắn... ");
            } else {
                log.warn("Received message is not of type Message: {}", deserialized);
            }
        } catch (Exception e) {
            log.error("Error processing message", e);
        }
    }
}
