package com.example.demo.service;

import com.example.demo.domain.dto.ChatMessageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
public class ChatServiceImpl implements ChatService{

    @Override
    public ChatMessageDto handleMessage(ChatMessageDto chatMessageDto) {
        // 서버 정밀 시간 설정
        LocalDateTime now = LocalDateTime.now();
        chatMessageDto.setCreatedAt(now);

        // 화면 표시용 시간으로 만들기(예: 오후 2:30)
        String formattedTime = now.format(DateTimeFormatter.ofPattern("a h:mm"));
        chatMessageDto.setSentTime(formattedTime);

        // 메시지 타입별 비즈니스 로직
        if (chatMessageDto.getMessageType() == ChatMessageDto.MessageType.ENTER) {
            chatMessageDto.setMessage(chatMessageDto.getSenderName() + "님이 입장하셨습니다.");
        }

        // 나중에 추가해야함 DB 저장 로직: chatRepository.save(entity);


        return chatMessageDto;
    }
}
