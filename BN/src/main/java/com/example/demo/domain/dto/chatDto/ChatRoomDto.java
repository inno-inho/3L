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

    @Schema(description = "사용자가 읽지 않은 메시지 총 개수", example = "5")
    private int unreadCount;

    @Schema(description = "채팅방 현재 인원수", example = "4")
    private int userCount;

    @Schema(description = "채팅방 대표 이미지 URL", example = "[\"url1\", \"url2\"]")
    private List<String> roomImageUrls;

}
