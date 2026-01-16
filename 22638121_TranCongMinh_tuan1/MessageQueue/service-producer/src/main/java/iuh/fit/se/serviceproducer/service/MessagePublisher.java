package iuh.fit.se.serviceproducer.service;

import iuh.fit.se.serviceproducer.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessagePublisher {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic topic;
    
    public void publish(Message message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
