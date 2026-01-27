package com.example.demo.service;

import com.example.demo.domain.Repository.NoticeFileRepository;
import com.example.demo.domain.dto.NoticeFileResponseDto;
import com.example.demo.domain.entity.NoticeEntity;
import com.example.demo.domain.entity.NoticeFileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoticeFileService {

    private final NoticeFileRepository noticeFileRepository;

    @Value("${file.upload.base-path}")
    private String basePath;

    @Value("${file.upload.notice-dir}")
    private String noticeDir;

    String fullPath = basePath + "/" + noticeDir;

    // 공지에 첨부된 파일들을 서버에 저장하고 DB에 기록
    public void saveFiles(NoticeEntity notice, List<MultipartFile> files){
        // 파일 없을 때 저장 로직 건너 뜀(종료)
        if (files == null || files.isEmpty()) return;

        // 파일 하나씩 처리
        for (MultipartFile file : files){
            try{
                // 1. 저장 파일명 생성
                String originalName = file.getOriginalFilename(); // 원본 파일명
                String savedName = UUID.randomUUID() + "_" + originalName; // UUID를 이용해 서버에 저장할 파일명 생성(중복 방지)

                // 2. 저장 경로 생성
                Path savePath = Paths.get(fullPath, savedName); // 실제 파일이 저장될 경로
                Files.createDirectories(savePath.getParent()); // 디렉토리가 없으면 생성

                // 3. 파일을 서버에 저장
                Files.copy(file.getInputStream(), savePath);

                // 4. DB 저장
                NoticeFileEntity noticeFile = new NoticeFileEntity(
                        originalName,
                        savedName,
                        savePath.toString(),
                        file.getSize(),
                        notice
                );
                noticeFileRepository.save(noticeFile);

            } catch (IOException e){
                // 파일 저장 실패시 예외 발생 → 트랜잭션 롤백
                throw new RuntimeException("파일 저장 실패", e);
            }
        }


    }

    // 파일 다운로드
    public ResponseEntity<Resource> download(Long fileId){
        // DB에서 파일 정보 조회
        NoticeFileEntity file = noticeFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일 없음"));
        try {
            // 서버에 저장된 파일 경로
            Path path = Paths.get(file.getFilePath());
            // 파일을 Resource 객체로 변환
            Resource resource = new UrlResource(path.toUri());
            // 다운로드 응답 반환
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + file.getOriginalName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e){
            throw new RuntimeException("파일 다운로드 실패", e);
        }

    }

    public List<NoticeFileResponseDto> getFilesByNoticeId(Long noticeId){
        return noticeFileRepository.findByNoticeId(noticeId)
                .stream()
                .map(NoticeFileResponseDto::from)
                .toList();
    }
}
