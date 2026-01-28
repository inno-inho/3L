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
        ChatRoomDto chatRoomDto = chatRoomService.createRoom(chatRoomCreateRequest.getRoomName(), chatRoomCreateRequest.getMemberEmails());

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
