package com.example.demo.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.messaging.Message;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "코코넛톡 통합 채팅 메시지 DTO")
public class ChatMessageDto {

    public enum ChatType {
        GROUP, FRIEND
    }

    public enum MessageType {
        // 채팅방 상태 관련
        ENTER, QUIT, SYSTEM,

        // 메시지 타입관련
        TEXT, IMAGE, VIDEO, FILE, URL_LINK,

        // 기능성 타입
        DELETE, // 메시지 삭제 요청
        TYPING // 입력 중 알링
    }

    @Schema(description = "메시지 고유 ID(삭제/읽음 식별용)", example = "1004")
    private Long messageId;

    @Schema(description = "메시지 타입", example = "IMAGE", required = true)
    private MessageType messageType;

    @Schema(description = "채팅방 종류", example = "GROUP")
    private ChatType chatType;

    @Schema(description = "채팅방 고유 ID", example = "room-abc-123", required = true)
    private String roomId;

    @Schema(description = "보낸 사람 ID(이메일 혹은 PK)", example = "Inno@naver.com")
    private String sender;

    @Schema(description = "보낸 사람 이름", example = "채팅개발자")
    private String senderName;

    @Schema(description = "보낸 사람 초성", example = "ㄱㅇㅂㅊㅈ")
    private String senderInitial;

    @Schema(description = "메시지 내용 (TEXT일 때 내용, 그 외에는 캡션)", example = "사진 보내여")
    private String message;

    // #######################################
    // 멀티미디어 기능 관련 필드
    // #######################################
    @Schema(description = "미디어/파일 실체 URL", example = "https://s3.coconut.com/images/a.jpg")
    private String fileUrl;

    @Schema(description = "이미지/영상 썸네일 URL", example = "https://s3.coconut.com/thumb/a.jpg")
    private String thumbnailUrl;

    @Schema(description = "파일 메타데이터(파일명, 용량, 재생시간 등 JSON 형태)", example = "{\\\"fileName\\\": \\\"vacation.mp4\\\", \\\"fileSize\\\": 20480, \\\"duration\\\": \\\"00:15\\\"}")
    private String metadata;

    // #######################################
    // 상태 관리 기능 관련 필드
    // #######################################
    @Schema(description = "안 읽은 사람 수(숫자 감소 방식)", example = "1")
    private Integer unreadCount;

    @Schema(description = "메시지 삭제 여부(나에게만/모두에게 삭제 처리용)", example = "false")
    private boolean isDeleted;

    // #######################################
    // 시간 관련 필드
    // #######################################
    @Schema(description = "화면 표시용 시간", example = "오후 2:30")
    private String sentTime;

    @JsonProperty("createdAt")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
    @Schema(description = "정밀 서버 시간")
    private LocalDateTime createdAt;

}
