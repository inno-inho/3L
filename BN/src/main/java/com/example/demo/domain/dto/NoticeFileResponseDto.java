package com.example.demo.domain.dto;

import com.example.demo.domain.entity.NoticeFileEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NoticeFileResponseDto {
    private Long id;
    private String originalName;
    private String filePath;
    private Long fileSize;

    public static NoticeFileResponseDto from(NoticeFileEntity entity){
        return new NoticeFileResponseDto(
                entity.getId(),
                entity.getOriginalName(),
                entity.getFilePath(),
                entity.getFileSize()
        );
    }
}
