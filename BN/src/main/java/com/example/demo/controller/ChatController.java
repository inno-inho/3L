package com.example.demo.controller;

import com.example.demo.domain.dto.ChatMessageDto;
import com.example.demo.domain.dto.TypingEventDto;
import com.example.demo.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Slf4j
@RequiredArgsConstructor
@Controller
public class ChatController {

    private final SimpMessageSendingOperations simpMessageSendingOperations;
    private final ChatService chatService;

    // 리액트 발행: client.publish ({destination: '/pub/chat/message', body:JSON.stringify(dto)})

    @MessageMapping("/chat/message")
    public void sendMessage(ChatMessageDto chatMessageDto){
        // 비즈니스 로직 처리 (시간 설정, 입장 메시지 등)
        ChatMessageDto processedMessage = chatService.handleMessage(chatMessageDto);

        // 리액트 구독: /sub/chat/room/{roomId}로 메시지 전송
        simpMessageSendingOperations.convertAndSend("/sub/chat/room/" + processedMessage.getRoomId(), processedMessage);
    }

    // 리액트 발행: client.publish({ destination: '/pub/chat/typing', body: JSON.stringify(dto) })
    @MessageMapping("/chat/typing")
    public void sendTypingEvent(TypingEventDto typingEventDto){
        // 타이핑 이벤트는 별도 저장 없이 해당 방의 구독자들에게 전송
        simpMessageSendingOperations.convertAndSend("/sub/chat/room" + typingEventDto.getRoomId() + "/typing", typingEventDto);
    }

}
