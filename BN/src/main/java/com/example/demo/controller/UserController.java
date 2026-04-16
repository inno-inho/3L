package com.example.demo.controller;

import com.example.demo.domain.Repository.Local_S3_FileService.FileService;
import com.example.demo.domain.dto.PasswordUpdateDto;
import com.example.demo.domain.dto.UserResponseDto;
import com.example.demo.domain.dto.UserUpdateDto;
import com.example.demo.service.AuthService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final FileService fileService;
    private final AuthService authService;

    // ########################################
    // 프로필 이미지 업로드/수정
    // ########################################
    @PostMapping("/profile-image")
    public ResponseEntity<String> updateProfileImage(
            @RequestParam("file")MultipartFile file,
            Authentication authentication) {

        String email = authentication.getName();    // 토큰에서 추출한 사용자 이메일

        // 파일 시스템에 저장(LocalFileService 실행)
        String imageUrl = fileService.uploadFile(file);

        if(imageUrl == null) {
            return ResponseEntity.badRequest().body("이미지 파일이 전송되지 않았습니다.");
        }

        // DB 정보 업데이트 (동시에 기존 파일 삭제)
        String resultUrl = userService.updateProfileImage(email, imageUrl);

        return ResponseEntity.ok(resultUrl);
    }

    // #########################################
    // 프로필 이미지 삭제
    // #########################################
    @DeleteMapping("/profile-image")
    public ResponseEntity<Void> deleteProfileImage(Authentication authentication) {
        String email = authentication.getName();

        userService.deleteProfileImage(email);

        return ResponseEntity.ok().build();
    }

    // ######################
    // 유저정보 업데이트
    // ######################
    @PatchMapping("/profile")
    public ResponseEntity<Void> updateUserInfo(
            @RequestBody UserUpdateDto userUpdateDto,
            Authentication authentication) {
        userService.updateUserInfo(authentication.getName(), userUpdateDto);

        return ResponseEntity.ok().build();
    }

    // #############################
    // 패스워드 업데이트
    // #############################
    @PatchMapping("/password")
    public ResponseEntity<String> updatePassword(
            @RequestBody PasswordUpdateDto passwordUpdateDto,
            Authentication authentication) {

        try {
            userService.updatePassword(authentication.getName(), passwordUpdateDto);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // #############################
    // 특정 유저 정보 가져오기
    // #############################
    @GetMapping("/info")
    public ResponseEntity<UserResponseDto> getUserInfoByEmail(@RequestParam("email") String email) {
        // 본인이든 남이든 그 이메잉ㄹ만 알면 그 사람의 닉네임과 프로필 사진 경로를 반환
        UserResponseDto userResponseDto = authService.getUserInfo(email);

        return ResponseEntity.ok(userResponseDto);
    }

}
