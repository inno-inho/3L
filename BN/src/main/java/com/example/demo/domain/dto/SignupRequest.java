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
//@Getter로 getEmail(), getPassword()...등과 같은 메서드 자동생성됨(다른 필드값도 마찬가지임)
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
    * -> 회원가입 이후 Entity의 password 필드에는
    *    Service에서 생성한 암호화된 비밀번호 값(encodedPassword)이 저장되어 있음
    * -> Entity는 이 값이 어디에서 왔는지 모름. 그저 자신의 password 필드에 저장된 값일 뿐
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
