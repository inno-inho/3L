package com.example.demo.controller;

import com.example.demo.domain.dto.NoticeFileResponseDto;
import com.example.demo.domain.dto.NoticeRequestDto;
import com.example.demo.domain.dto.NoticeResponseDto;
import com.example.demo.domain.entity.NoticeEntity;
import com.example.demo.service.NoticeFileService;
import com.example.demo.service.NoticeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/notices")
public class NoticeController {

    // 항상 service를 통해서만 처리(controller가 직접 DB 접근 x)
    private final NoticeService noticeService;

    private final NoticeFileService noticeFileService;

    // @RequestBody : Json body -> 객체로 변환 POST/PUT에서 사용
    // @PathVariable : URL 경로 값 추출 notices/{id}

    // 공지 생성
    @PostMapping(consumes= MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NoticeResponseDto> createNotice(
            @RequestBody NoticeRequestDto noticeRequest, // JSON 데이터(프론트에서 FormData로 "notice"라는 이름으로 보내야함
            @RequestPart(value="files", required = false) List<MultipartFile> files
    ){
        System.out.println("[Notice:CreateNotice] " + noticeRequest);
        NoticeEntity notice = noticeService.createNotice(noticeRequest,files); // DTO -> Entity 변환 : DB 저장
        return ResponseEntity.ok(NoticeResponseDto.from(notice)); // Entity -> ResponseDto 변환, HTTP 200 + Json 응답
    }


    // 공지 조회
    // 페이지하기 위해 ResponseEntity<Page<NoticeResponseDto>>
    @GetMapping("")
    public ResponseEntity<Page<NoticeResponseDto>> getAllNotices(
            @RequestParam(required = false) String keyword, // 검색파라미터 추가
            @PageableDefault(
                    size = 5,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(noticeService.getAllNotices(keyword, pageable)); // Service에서 두개의 파라미터를 받고 있으므로
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponseDto> getNoticesById(@PathVariable Long id){
        NoticeEntity notice = noticeService.getNoticesById(id);
        return ResponseEntity.ok(NoticeResponseDto.from(notice));
    }

    // 공지 수정
    @PutMapping("/{id}")
    public ResponseEntity<NoticeResponseDto> updateNotice(@PathVariable Long id, @RequestBody NoticeRequestDto noticeRequest){
        System.out.println("[Notice:updateNotice] " + noticeRequest);

        NoticeEntity notice = noticeService.updateNotice(id, noticeRequest); // 존재 여부 확인, 필드 수정, 저장
        return ResponseEntity.ok(NoticeResponseDto.from(notice));
    }

    // 공지 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id){
        System.out.println("[Notice:deleteNoticeById] "+id);
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }


}
