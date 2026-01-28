package com.example.demo.controller;

import com.example.demo.domain.dto.NoticeFileResponseDto;
import com.example.demo.service.NoticeFileService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notices")
public class NoticeFileController {

    private final NoticeFileService noticeFileService;

    // 첨부된 파일 목록 조회
    @GetMapping("/{noticeId}/files")
    public List<NoticeFileResponseDto> getFiles(@PathVariable Long noticeId){
        return noticeFileService.getFilesByNoticeId(noticeId);
    }

    // 파일 다운로드
    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId){
        return noticeFileService.download(fileId);
    }

    // 수정시 파일 단건 삭제
    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId){
        noticeFileService.deleteFile(fileId);
        return ResponseEntity.noContent().build();

    }

    // 수정시 여러 파일 삭제
    @DeleteMapping("/files")
    public ResponseEntity<Void> deleteFiles(@RequestBody List<Long> fileIds){
        noticeFileService.deleteFiles(fileIds);
        return ResponseEntity.noContent().build();
    }
}
