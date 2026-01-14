package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();     // JSON으로 직렬화 해서 Redis에 저장
        template.setConnectionFactory(connectionFactory);

        // Key는 String으로 직렬화 => "chat:room:1" "user:online:123"
        template.setKeySerializer(new StringRedisSerializer());

        // Value는 JSON 형태로 직렬화 (ChatMessageEntity 등을 저장하기 위함)
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        return template;
    }
}