package com.example.demo.service;

import com.example.demo.domain.dto.ChatMessageDto;

public interface ChatService {
    ChatMessageDto handleMessage(ChatMessageDto chatMessageDto);
}


