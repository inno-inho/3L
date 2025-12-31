package com.example.demo.controller;

import com.example.demo.domain.dto.NoticeRequestDto;
import com.example.demo.domain.dto.NoticeResponseDto;
import com.example.demo.domain.entity.NoticeEntity;
import com.example.demo.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    // 항상 service를 통해서만 처리(controller가 직접 DB 접근 x)
    @Autowired
    private NoticeService noticeService;

    public NoticeController(NoticeService noticeService){
        this.noticeService = noticeService;
    }
    // @RequestBody : Json body -> 객체로 변환 POST/PUT에서 사용
    // @PathVariable : URL 경로 값 추출 notices/{id}

    // 공지 생성
//    @PostMapping(consumes= MediaType.MULTIPART_FORM_DATA_VALUE)
//    , @RequestPart MultipartFile file
    @PostMapping()
    public ResponseEntity<NoticeResponseDto> createNotice(@RequestBody NoticeRequestDto noticeRequest){
        System.out.println("[Notice:CreateNotice] " + noticeRequest);
        NoticeEntity notice = noticeService.createNotice(noticeRequest); // DTO -> Entity 변환 : DB 저장
        return ResponseEntity.ok(new NoticeResponseDto(notice)); // Entity -> ResponseDto 변환, HTTP 200 + Json 응답
    }

    // 공지 조회
    @GetMapping("")
    public List<NoticeResponseDto> getAllNotices(){
        System.out.println("[Notice:getAllNotices] ");
        return noticeService.getAllNotices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeEntity> getNoticesById(@PathVariable Long id){
        return ResponseEntity.ok(noticeService.getNoticesById(id));
    }

    // 공지 수정
    @PutMapping("/{id}")
    public ResponseEntity<NoticeResponseDto> updateNotice(@PathVariable Long id, @RequestBody NoticeRequestDto noticeRequest){
        System.out.println("[Notice:updateNotice] " + noticeRequest);

        NoticeEntity notice = noticeService.updateNotice(id, noticeRequest); // 존재 여부 확인, 필드 수정, 저장
        return ResponseEntity.ok(new NoticeResponseDto(notice));
    }

    // 공지 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id){
        System.out.println("[Notice:deleteNoticeById] "+id);
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
