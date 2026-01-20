package com.example.demo.domain.Repository.Local_S3_FileService;

import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Primary    // 인터페이스를 주입할 시 기본적으로 이 클래스를 사용하도록 설정하는 거
@Profile("local")   // profile을 local로 실행할 때는 이걸로
public class LocalFileService implements FileService {

    // 파일이 저장될 로컬 경로
    private final String uploadDir = "C:/chat_uploads/";

    @Override
    public String uploadFile(MultipartFile multipartFile) {
        if (multipartFile.isEmpty()) return null;

        try {
            // 파일 저장할 폴더가 없다면 생성
            File folder = new File(uploadDir);
            if (!folder.exists()) folder.mkdirs();

            // 파일명 중복 방지를 위해 UUID 사용
            String originalFileName = multipartFile.getOriginalFilename();
            String saveFileName = UUID.randomUUID() + "_" + originalFileName;
            Path filePath = Paths.get(uploadDir + saveFileName);

            // 파일 물리적 저장
            Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 접근 가능한 경로 반환
            return "/uploads/" + saveFileName;
        }catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류 발생");
        }
    }
}
