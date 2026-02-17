package com.example.demo.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private String email;
    private String nickname;
    private String profileImageUrl;
    private String statusMessage;
    private String role;
    private String phone;
    private String gender;
    private String birth;
    private String username;

}
