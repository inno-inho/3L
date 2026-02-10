package com.example.demo.config;

import com.example.demo.config.auth.jwt.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;    // WebSocket에서 보안관련 StompHandler 주입

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 클라이언트가 소켓에 연결할 지점
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");  // CORS 허용
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 메시지를 구독(수신)하는 주소 접두사
        registry.enableSimpleBroker("/sub");
        // 메시지를 발행(송신)하는 주소 접두사
        registry.setApplicationDestinationPrefixes("/pub");
    }

    // 인터셉터 등록
    @Override
    public void configureClientInboundChannel(ChannelRegistration channelRegistration) {
//        channelRegistration.interceptors(stompHandler);
    }
}