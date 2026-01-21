package com.example.demo.eventListener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatEventListener {
    private final SimpMessagingTemplate simpMessagingTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)  // DB에 데이터가 저잗된 후에 리스너를 실행
//    @EventListener
    public void handleChatEvent(ChatMessageEvent event) {

//        log.info("일반 이벤트 리스너 작동확인!, ChatEventListener");
        log.info("메시지 브로드캐스팅 시도!, ChatEventListener");
        log.info("이벤트 수신 확인: {}", event.chatMessageDto().getMessage());
        simpMessagingTemplate.convertAndSend("/sub/chat/" + event.roomId(), event.chatMessageDto());
    }
}


