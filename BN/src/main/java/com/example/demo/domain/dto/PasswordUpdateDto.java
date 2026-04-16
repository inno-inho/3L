package com.example.demo.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PasswordUpdateDto {
    private String currentPassword;
    private String newPassword;
}
