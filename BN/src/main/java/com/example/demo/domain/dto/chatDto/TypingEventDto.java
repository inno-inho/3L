package com.example.demo.domain.dto.chatDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypingEventDto {
    private String roomId;
    private String senderName;
    private boolean isTyping;   // 입력 시작 시 true, 멈추면 false
}
