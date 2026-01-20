package com.example.demo.config.auth.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;   // WebSocket으로 오가는 메시지
import org.springframework.messaging.MessageChannel;    // 메시지가 지나가는 통로
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;    // STOMP 헤더 쉽게 다루는 도구
import org.springframework.messaging.support.ChannelInterceptor;    // 메시지 가로채는 인터셉텉
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component  // 스프링 빈으로 등록
public class StompHandler implements ChannelInterceptor {       // ChannelInterceptor -> 웹 소켓 메시지가 지나갈 때 가로채겠다

//    private final JWTTokenProvider jwtTokenProvider;          // token관련 완성되면 주석 해제

    // 메시지가 채널로 전송되기 전에 실행됨
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel messageChannel) {
        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.wrap(message);    // Stomp 헤더 꺼내기, 메시지 안에 있는 Stomp 정보 접근

        // WebSocket 연결 시 헤더 검증
        if(StompCommand.CONNECT.equals(stompHeaderAccessor.getCommand())){  // Connect 요청인지 확인
            log.info("[StompHandler] WebSocket 연결 요청 감지, StompHandler");              // Stomp Connect란? WebSocket에서 서버랑 연결할게요 하는 첫 요청

//            // 헤더에서 토큰 추출(Authorization 또는 access-token)
//            String jwtToken = stompHeaderAccessor.getFirstNativeHeader("Authorization");  // JWT 토큰 추출
//            if (jwtToken == null) {
//                jwtToken = stompHeaderAccessor.getFirstNativeHeader("access-token");      // 없다면 대체 키 확인
//            }
//
//            // Bearer 제거, JWT 라이브러리는 순수 토큰 문자열만 필요하기 때문에
//            if (jwtToken != null && jwtToken.startsWith("Bearer ")){
//                jwtToken = jwtToken.substring(7);
//            }
//
//            // 토큰 유효성 검증 및 인증 객체 설정
//            try {
//                if (jwtToken != null && jwtTokenProvider.validateToken(jwtToken)) {   // validateToken -> 토큰 위조 여부, 만료 여부 검사
//                    Authentication authentication = jwtTokenProvider.getAuthentication(jwtToken); // 사용자 ID나 권한(ROLE_USER 같은) 가져옴
//                    stompHeaderAccessor.setUser(authentication);   // WebSocket 세션에 인증 정보 주입, 세션의 사용자를 설정
//                    log.info("[StompHandler] 인증 성공, 접속자의 이름은?: {}", authentication.getName());
//                } else {
//                    log.warn("[StompHandler] 유효하지 않은 토큰입니다.");
//                    // 필요하면 여기서 예외를 던져서 연결을 끊는 것도 가능

//                }
//            } catch (Exception e) {
//                log.warn("[StompHandler] 토큰 검증 오류: {}", e.getMessage());
//            }
            log.info("[StompHandler] 개발 모드: 인증 절차 없이 연결을 허용합니다.");  // 인증관련 기능 개발 끝나면 위에 거 주석 해지 및 현재 이 코드 삭제
        }
        return message;
    }

}
