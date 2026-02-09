package com.example.demo.controller.chatControllers;

import com.example.demo.domain.dto.chatDto.ChatRoomCreateRequest;
import com.example.demo.domain.dto.chatDto.ChatRoomDto;
import com.example.demo.service.chatServices.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatrooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    // #######################################
    // 채팅방 샏성
    // #######################################
    @PostMapping
    public ResponseEntity<ChatRoomDto> createRoom(@RequestBody ChatRoomCreateRequest chatRoomCreateRequest) {
        // 프론트엔드 ChatPage에서 [...selectedEmails, user?.email] 형태로 보냈으므로
        // 리스트의 마지막 요소가 방장의 이메일

        List<String> emails = chatRoomCreateRequest.getMemberEmails();
        String creatorEmail = emails.get(emails.size() - 1);

        ChatRoomDto chatRoomDto = chatRoomService.createRoom(
                chatRoomCreateRequest.getRoomName(),
                emails,
                creatorEmail
        );

        return ResponseEntity.ok(chatRoomDto);
    }

    // ########################################
    // 내 채팅방 목록 가져오기 (테스트 확인용)
    // ########################################
    @GetMapping
    public ResponseEntity<List<ChatRoomDto>> getMyRooms(@RequestParam String email) {
        return ResponseEntity.ok(chatRoomService.findAllRooms(email));
    }

}
