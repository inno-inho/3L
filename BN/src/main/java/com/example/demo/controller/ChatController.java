package com.example.demo.controller;

import com.example.demo.domain.dto.ChatMessageDto;
import com.example.demo.domain.dto.ChatMessageRequestDto;
import com.example.demo.domain.dto.TypingEventDto;
import com.example.demo.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chatrooms")
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    //  메시지 전송 및 저장
    @PostMapping("/{roomId}/send")
    public ResponseEntity<ChatMessageDto> sendMessage(
            @PathVariable String roomId,
            @ModelAttribute ChatMessageRequestDto chatMessageRequestDto) {

        // 서비스에서 DB 저장 및 DTO 변환 (파일 업로드 포함)
        ChatMessageDto savedMessage = chatService.saveMessage(chatMessageRequestDto);

        // WebSocket으로 해당 방 구독자들에게 실시간 전송
        simpMessagingTemplate.convertAndSend("/topic/chat/" + roomId, savedMessage);

        return ResponseEntity.ok(savedMessage);
    }

    // 채팅 내역 불러오기
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<ChatMessageDto> history = chatService.getChatHistory(roomId, page, size);

        return ResponseEntity.ok(history);
    }
}
