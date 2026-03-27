package com.example.demo.domain.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDto {
    private String nickname;
    private String phone;
    private String statusMessage;
}
