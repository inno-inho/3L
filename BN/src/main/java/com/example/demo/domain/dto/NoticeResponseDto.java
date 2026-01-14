package com.example.demo.domain.dto;

import com.example.demo.domain.entity.NoticeEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
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

    public NoticeResponseDto(NoticeEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.authorId = entity.getAuthorId();
        this.viewCount = entity.getViewCount();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }

}
