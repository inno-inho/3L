package com.example.demo.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

//FE에서 보내주는 이메일과 비밀번호를 담을 그릇

@Getter
@NoArgsConstructor
public class LoginRequest {
    private String email;    // 사용자가 입력한 이메일
    private String password; // 사용자가 입력한 비밀번호
}
