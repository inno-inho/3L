package com.example.demo.service;

import com.example.demo.domain.Repository.Local_S3_FileService.FileService;
import com.example.demo.domain.dto.PasswordUpdateDto;
import com.example.demo.domain.dto.UserUpdateDto;
import com.example.demo.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Transactional
@Service
public class UserService {
    private final com.example.demo.domain.repository.UserRepository userRepository;
    private final FileService fileService;
    private final PasswordEncoder passwordEncoder;

    // 프로필 이미지 업데이트
    public String updateProfileImage(String email, String imageUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 기존에 프로필 이미지가 저장되어있다면 서버(C드라이브)에서 물리적으로 삭제
        if(user.getProfileImageUrl() != null) {
            fileService.deleteFile(user.getProfileImageUrl());
        }

        user.updateProfileImage(imageUrl);
        return imageUrl;
    }

    // 프로필 이미지 삭제(기본 이미지로)
    public void deleteProfileImage(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 기존 파일이 있다면 물리적 삭제
        if (user.getProfileImageUrl() != null) {
            fileService.deleteFile(user.getProfileImageUrl());
        }

        user.deleteProfileImage();
    }

    // 유저정보 업데이트
    public void updateUserInfo(String email, UserUpdateDto userUpdateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        user.updateProfile(userUpdateDto);
    }

    // 패스워드 업데이트
    public void updatePassword(String email, PasswordUpdateDto passwordUpdateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 현재 비밀번호 일치 여부
        if (!passwordEncoder.matches(passwordUpdateDto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 암호화 및 저장
        user.updatePassword(passwordEncoder.encode(passwordUpdateDto.getNewPassword()));

    }

}
