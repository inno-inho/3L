package com.example.demo.domain.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@ToString
public class ChatMessageRequestDto {
    private String roomId;
    private String sender;
    private String message;
    private ChatMessageDto.MessageType messageType; // TEXT나 IMAGE 등
    private List<MultipartFile> files;   // 실제 파일들

    // 답장 기능 관련 필드
    private Long parentMessageId;
    private String parentMessageSenderName;
    private String parentMessageContent;




}
