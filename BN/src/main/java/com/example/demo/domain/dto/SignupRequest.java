package com.example.demo.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

//Controller 입구에서 사용자 입력을 검증하는 객체

/**
 * 회원가입 요청 DTO
 *
 * - JSON 요청 바디를 매핑
 * - Validation 역할
 * - Entity와 완전히 분리됨
 */

@Getter
@NoArgsConstructor

public class SignupRequest {
    /*
    * 이메일 형식 검증
    * */
    @Email
    @NotBlank
    private String email;

    /*
    * 비밀번호는 DTO에서는 평문 상태
    * -> Service에서 암호화
    * */
    @NotBlank
    private String password;

    @NotBlank
    private String nickname;

    @NotBlank
    private String username;

    @NotBlank
    private String phone;

}
