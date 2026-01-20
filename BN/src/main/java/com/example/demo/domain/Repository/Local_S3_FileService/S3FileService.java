package com.example.demo.domain.Repository.Local_S3_FileService;

import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
//@Primary // 나중에 S3 쓰게 되면 이 구현체 쓰면 됌
@Profile("prod")    // profile을 prod로 실행할 때는 여기 사용
public class S3FileService implements FileService {

    @Override
    public String uploadFile(MultipartFile multipartFile) {

        //TODO
        // AWS S3 업로드 로직 작성
        // return s3Client.getUrl(...).toString();

//        return "aws  버킷 url ";
        return null;
    }
}
