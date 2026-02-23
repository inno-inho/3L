package com.example.demo.controller;

import com.example.demo.domain.dto.UserResponseDto;
import com.example.demo.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService friendService;

    // ##############################
    // 친구 찾기 (유저 검색)
    // ##############################
    @GetMapping("/search")
    public ResponseEntity<List<UserResponseDto>> searchUsers(@RequestParam String keyword,
                                                             Authentication authentication) {

        // 로그인 할 때 사용한 email을 반환
        String currentUserEmail = authentication.getName();

        List<UserResponseDto> users = friendService.searchUsers(keyword, currentUserEmail);
        return ResponseEntity.ok(users);
    }

    // #############################
    // 친구 신청 보내기
    // #############################
    @PostMapping("/request")
    public ResponseEntity<String> requestFriend(
            @RequestParam String targetEmail,
            Authentication authentication) {

        String currentUserEmail = authentication.getName();
        friendService.requestFriend(currentUserEmail, targetEmail);

        return  ResponseEntity.ok("친구 신청을 보냈습니다.");
    }

    // ###############################
    // 나에게 온 친구 신청 목록 조회
    // ###############################
    @GetMapping("/pending")
    public ResponseEntity<List<UserResponseDto>> getPendingRequests (
            Authentication authentication) {

        String currentUserEmail = authentication.getName();
        List<UserResponseDto> requests = friendService.getPendingRequests(currentUserEmail);

        return ResponseEntity.ok(requests);
    }

    // ###################################
    // 친구 신청 받아주기
    // ###################################
    @PostMapping("/accept")
    public ResponseEntity<String> acceptFriend (
            @RequestParam String requesterEmail,
            Authentication authentication) {

        String currentUserEmail = authentication.getName();
        friendService.acceptFriend(currentUserEmail, requesterEmail);

        return ResponseEntity.ok("친구 요청을 수락했습니다.");
    }


    // ###################################
    // 친구 삭제
    // ###################################
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFriend (
          @RequestParam  String friendEmail,
          Authentication authentication) {

        String myEmail = authentication.getName();
        friendService.deleteFriend(myEmail, friendEmail);

        return ResponseEntity.ok("친구 삭제가 완료되었습니다.");
    }

    // ###################################
    // 친구 신청 거절
    // ###################################
    @PostMapping("/reject")
    public ResponseEntity<String> rejectFriendRequest (
            @RequestParam String requesterEmail,
            Authentication authentication) {

        String myEmail = authentication.getName();
        friendService.rejectFriendRequest(myEmail, requesterEmail);

        return ResponseEntity.ok("친구 신청을 거절했습니다.");
    }

    // ##################################
    // 내 친구 목록 조회(진짜 친구들)
    // ##################################
    @GetMapping("/list")
    public ResponseEntity<List<UserResponseDto>> getFriendList(Authentication authentication) {
        String myEmail = authentication.getName();

        List<UserResponseDto> friends = friendService.getAcceptedFriends(myEmail);

        return ResponseEntity.ok(friends);
    }


    // ####################################
    // 유저 차단
    // ####################################
    @PostMapping("/block")
    public ResponseEntity<String> blockUser(
            @RequestParam String targetEmail,
            Authentication authentication) {

        // 차단을 수행하는 본인의 이메일
        String requestEmail = authentication.getName();

        friendService.blockUser(requestEmail, targetEmail);

        return ResponseEntity.ok("해당 사용자를 차단하였습니다.");
    }

}
