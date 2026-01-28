package com.example.demo.domain.dto;

import com.example.demo.domain.entity.NoticeFileEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeFileResponseDto {
    private Long id;
    private String originalName;
    private String filePath;
    private Long fileSize;

    public static NoticeFileResponseDto from(NoticeFileEntity entity){
        return NoticeFileResponseDto.builder()
                .id(entity.getId())
                .originalName(entity.getOriginalName())
                .fileSize(entity.getFileSize())
                .build();

    }
}
