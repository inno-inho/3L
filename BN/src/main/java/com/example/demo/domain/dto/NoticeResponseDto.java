package com.example.demo.domain.dto;

import com.example.demo.domain.entity.NoticeEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NoticeResponseDto {

    // Entity -> ResponseDto로 변환해서 반환?
    private Long id;
    private String title;
    private String content;
    private String authorId;
    private int viewCount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // Service가 Page.map()을 쓰게 바꿈
    public static NoticeResponseDto from(NoticeEntity entity) {
        return new NoticeResponseDto(
            entity.getId(),
            entity.getTitle(),
            entity.getContent(),
            entity.getAuthorId(),
            entity.getViewCount(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }

}
