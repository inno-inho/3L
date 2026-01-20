package com.example.demo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();     // JSON으로 직렬화 해서 Redis에 저장
        redisTemplate.setConnectionFactory(connectionFactory);

        // LocalDateTime을 처리할 수 있는 ObjectMapper 설정
        ObjectMapper objectMapper = new ObjectMapper();
        // Java 8 날짜 모듈 등록
        objectMapper.registerModule(new JavaTimeModule());
        // 날짜를 배열이 아닌 문자열로 저장
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // 설정된 ObjectMapper를 사용하는 Serializer 생성
        GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        // Key는 String으로 직렬화 => "chat:room:1" "user:online:123"
        redisTemplate.setKeySerializer(new StringRedisSerializer());

        // Value는 JSON 형태로 직렬화 (ChatMessageEntity 등을 저장하기 위함)
        redisTemplate.setValueSerializer(genericJackson2JsonRedisSerializer);

        return redisTemplate;
    }
}