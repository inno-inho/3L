package com.example.demo.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InviteRequestDto {
    private List<String> inviteeEmails;     // 초대할 사람 리스트
    private String requesterEmail;      // 초대한 사람 이메일
}
