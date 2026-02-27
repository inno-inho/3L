package com.example.demo.controller.chatControllers;

import com.example.demo.domain.dto.InviteRequestDto;
import com.example.demo.domain.dto.chatDto.ChatRoomCreateRequestDto;
import com.example.demo.domain.dto.chatDto.ChatRoomDto;
import com.example.demo.service.chatServices.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatrooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    // #######################################
    // 채팅방 생성
    // #######################################
    @PostMapping
    public ResponseEntity<ChatRoomDto> createRoom(@RequestBody ChatRoomCreateRequestDto chatRoomCreateRequestDto) {
        ChatRoomDto chatRoomDto = chatRoomService.createRoom(
                chatRoomCreateRequestDto.getRoomName(),
                chatRoomCreateRequestDto.getMemberEmails(),
                chatRoomCreateRequestDto.getRequesterEmail() // 명확한 데이터 사용
        );

        return ResponseEntity.ok(chatRoomDto);
    }

    // ########################################
    // 내 채팅방 목록 가져오기
    // ########################################
    @GetMapping
    public ResponseEntity<List<ChatRoomDto>> getMyRooms(@RequestParam String email) {
        return ResponseEntity.ok(chatRoomService.findAllRooms(email));
    }

    // ########################################
    // 방 이름 수정
    // ########################################
    @GetMapping("/{roomId}")
    public ResponseEntity<ChatRoomDto> getRoomDetail(
            @PathVariable String roomId,
            @RequestParam String email) {
        return ResponseEntity.ok(chatRoomService.getRoomDetail(roomId, email));
    }

    // ########################################
    // 방 이름 수정
    // ########################################
    @PatchMapping("/{roomId}/name")
    public ResponseEntity<Void> updateRoomName (
            @PathVariable String roomId,
            @RequestBody Map<String, String> request) {
        String newName = request.get("roomName");
        chatRoomService.updateRoomName(roomId, newName);

        return ResponseEntity.ok().build();
    }

    // ########################################
    // 멤버 강퇴
    // ########################################
    @DeleteMapping("/{roomId}/members/{userEmail}")
    public ResponseEntity<Void> kickMember (
            @PathVariable String roomId,
            @PathVariable String userEmail,
            @RequestParam String requestUserEmail) {
        chatRoomService.kickMember(roomId, userEmail, requestUserEmail);

        return ResponseEntity.ok().build();
    }

    // ########################################
    // 멤버 초대
    // ########################################
    @PostMapping("/{roomId}/invite-update")
    public ResponseEntity<Void> inviteMembers (
            @PathVariable String roomId,
            @RequestBody InviteRequestDto inviteRequestDto) {
        chatRoomService.inviteMembers(
                roomId,
                inviteRequestDto.getInviteeEmails(),
                inviteRequestDto.getRequesterEmail()
        );

        return ResponseEntity.ok().build();
    }

    // #########################################
    // 방 나가기
    // #########################################
    @PostMapping("/{roomId}/leave")
    public ResponseEntity<Void> leaveRoom (
            @PathVariable String roomId,
            @RequestParam String userEmail) {
        chatRoomService.leaveRoom(roomId, userEmail);

        return ResponseEntity.ok().build();
    }

    // #########################################
    // 방장 권환 위임
    // #########################################
    @PostMapping("/{roomId}/transfer-owner")
    public ResponseEntity<?> transferOwner (
            @PathVariable String roomId,
            @RequestParam String nextOwnerEmail,
            @RequestParam String requesterEmail) {
        chatRoomService.transferOwner(roomId, nextOwnerEmail, requesterEmail);

        return ResponseEntity.ok().build();
    }

}
