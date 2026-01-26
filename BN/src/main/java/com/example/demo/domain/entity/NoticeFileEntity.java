package com.example.demo.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter // Entity를 다른 곳에서 사용하기 위해
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="notice_files")
public class NoticeFileEntity {

    @Id
    @GeneratedValue
    private Long id;

    private String originalName; // 사용자가 올린 파일명
    private String savedName; // 서버에 저장된 파일명
    private String filePath; // 저장 경로
    private Long fileSize; // 파일사이즈

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="notice_id")
    private NoticeEntity notice;

    public NoticeFileEntity(
            String originalName,
            String savedName,
            String filePath,
            Long fileSize,
            NoticeEntity notice
    ) {
        this.originalName = originalName;
        this.savedName = savedName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.notice = notice;
    }
}
