package com.example.demo.controller.chatControllers;

import com.example.demo.domain.dto.chatDto.ChatMessageDto;
import com.example.demo.domain.dto.chatDto.ChatMessageRequestDto;
import com.example.demo.service.chatServices.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

    // ######################################
    //  메시지 전송 및 저장
    // ######################################
    @PostMapping("/{roomId}/send")
    public ResponseEntity<ChatMessageDto> sendMessage(
            @PathVariable String roomId,
            @ModelAttribute ChatMessageRequestDto chatMessageRequestDto) {

        // 서비스에서 DB 저장 및 DTO 변환 (파일 업로드 포함)
        ChatMessageDto savedMessage = chatService.saveMessage(chatMessageRequestDto);

//         여기서 직접 전송하지 않고 Service 내부에서 발생시킨 이벤트를 기다린다


//        // WebSocket으로 해당 방 구독자들에게 실시간 전송
//        simpMessagingTemplate.convertAndSend("/topic/chat/" + roomId, savedMessage);
//
        return ResponseEntity.ok(savedMessage);
    }

//    // 커밋이 성공한 후에만 실행되는 리스너
//    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
//    public void handleChatEvent (ChatMessageEvent chatMessageEvent) {
//        simpMessagingTemplate.convertAndSend("/sub/chat/" + chatMessageEvent.roomId(), chatMessageEvent.chatMessageDto());        // 구독 주소 잡기
//    }

    // ########################################
    // 채팅 내역 불러오기
    // ########################################
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(
            @PathVariable String roomId,
            @RequestParam(required = false) Long lastMessageId,
            @RequestParam(defaultValue = "50") int size) {
        List<ChatMessageDto> history = chatService.getChatHistory(roomId, lastMessageId, size);

        return ResponseEntity.ok(history);
    }

    // ########################################
    // 채팅 삭제하기
    // ########################################
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage (
            @PathVariable Long messageId,
            @RequestParam String email) {

        chatService.deleteMessage(messageId, email);

        return ResponseEntity.ok().build();
    }

}
