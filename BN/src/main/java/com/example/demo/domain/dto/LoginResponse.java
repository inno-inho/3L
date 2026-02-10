package com.example.demo.domain.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private String token;   //FE가 보관할 통행증(JWT)
    private String email;   //사용자 확인용
    private String nickname; //화면에 표시할 이름
}
