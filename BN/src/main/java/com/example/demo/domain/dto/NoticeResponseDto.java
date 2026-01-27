package com.example.demo.domain.dto;

import com.example.demo.domain.entity.NoticeEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
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

    private List<NoticeFileResponseDto> files;

    // Service가 Page.map()을 쓰게 바꿈
    public static NoticeResponseDto from(NoticeEntity entity) {
        return NoticeResponseDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .authorId(entity.getAuthorId())
                .viewCount(entity.getViewCount())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .files(
                        entity.getFiles().stream()
                                .map(NoticeFileResponseDto::from)
                                .toList()
                )
                .build();

    }

}
