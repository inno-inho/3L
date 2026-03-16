package com.example.demo.domain.dto.chatDto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "채팅방 목록 응답용(보여주는) DTO")
public class ChatRoomDto {

    @Schema(description = "채팅방 고유 ID", example = "room-abc-123")
    private String roomId;

    @Schema(description = "채팅방 이름", example = "코코넛톡 공지방")
    private String roomName;

    @Schema(description = "채팅방 타입", example = "GROUP")
    private ChatMessageDto.ChatType chatRoomType;

    @Schema(description = "마지막으로 수신된 메시지 내용", example = "두바이 쫀득 쿠키")
    private String lastMessage;

    @Schema(description = "마지막 메시지 전송 시간", example = "오후 4:30")
    private String lastMessageTime;

    @Schema(description = "마지막 메시지 보낸 사람", example = "이노3")
    private String lastMessageSender;

    @Schema(description = "사용자가 읽지 않은 메시지 총 개수", example = "5")
    private int unreadCount;

    @Schema(description = "채팅방 현재 인원수", example = "4")
    private int userCount;

    @Schema(description = "채팅방 대표 이미지 URL", example = "[\"url1\", \"url2\"]")
    private List<String> roomImageUrls;

    @Schema(description = "채팅방에 참여중인 멤버들 닉네임", example = "이노, 헤렌, 사랑해, 마니마니, 평생......")
    private List<MemberInfo> memberNames;

    @Data
    public static class MemberInfo {
        private String email;
        private String name;
    }

    @Schema(description = "채팅방에 참여중인 멤버들 이메일", example = "[\\\"user1@test.com\\\", \\\"user2@test.com\\\"]")
    private List<String> memberEmails;

    @Schema(description = "방장의 이메일 (권한 확인용)", example = "owner@test.com")
    private String ownerEmail;
}
