package com.example.demo.domain.dto.chatDto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomCreateRequest {

    private String roomName;
    private List<String> memberEmails;   // 초대할 유저들의 이메일 리스트
}
