package com.example.demo.eventListener;

import com.example.demo.domain.dto.chatDto.ChatMessageDto;

public record ChatMessageEvent(String roomId, ChatMessageDto chatMessageDto) { }
