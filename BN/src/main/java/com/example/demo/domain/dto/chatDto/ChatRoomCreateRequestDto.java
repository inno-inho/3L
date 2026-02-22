package com.example.demo.domain.dto.chatDto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomCreateRequestDto {

    @Schema(description = "채팅방 이름", example = "임과 함께")
    private String roomName;

    @Schema(description = "초대할 유저들의 이메일 리스트(방장 포함)", example = "[\\\"user1@test.com\\\", \\\"user2@test.com\\\"]")
    private List<String> memberEmails;   // 초대할 유저들의 이메일 리스트

    @Schema(description = "방장의 이메일", example = "creator@test.com")
    private String requesterEmail;
}
