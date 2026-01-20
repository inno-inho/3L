package com.example.demo.domain.Repository.Local_S3_FileService;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    //  파일을 저장하고 접근 가능한 URL 경로를 반환함
    String uploadFile(MultipartFile multipartFile);

    // 파일 삭제 기능 등 추가 가능
}
