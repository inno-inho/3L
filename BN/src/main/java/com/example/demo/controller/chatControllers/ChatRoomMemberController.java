package com.example.demo.controller.chatControllers;


import com.example.demo.service.chatServices.ChatRoomMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// ##########################################
// 채팅방 입장이나 퇴장 초대 등을 관리하는 클래스
// ##########################################
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chatrooms")
public class ChatRoomMemberController {
    private final ChatRoomMemberService chatRoomMemberService;

    // ##############################
    // 채팅방 입장
    // ##############################
    @PostMapping("/{roomId}/join")
    public ResponseEntity<Void> joinRoom(
            @PathVariable String roomId,
            @RequestParam String email) {
        chatRoomMemberService.joinRoom(roomId, email);

        return ResponseEntity.ok().build();
    }

    // ##############################
    // 채팅방 나가기
    // ##############################
    @PostMapping("/{roomId}/leave")
    public ResponseEntity<Void> leaveRoom(
            @PathVariable String roomId,
            @RequestParam String email) {
        chatRoomMemberService.leaveRoom(roomId, email);

        return ResponseEntity.ok().build();
    }

    // ##############################
    // 채팅방 나가기
    // ##############################
    @PostMapping("/{roomId}/invite")
    public ResponseEntity<Void> inviteUser (
            @PathVariable String roomId,
            @RequestParam String email) {
        chatRoomMemberService.inviteUser(roomId, email);

        return ResponseEntity.ok().build();
    }



}
