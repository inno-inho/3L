package com.example.demo.controller;

import com.example.demo.domain.dto.NoticeRequestDto;
import com.example.demo.domain.entity.NoticeEntity;
import com.example.demo.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // 공지 생성
    @PostMapping("")
    public ResponseEntity<NoticeEntity> CreateNotice(@RequestBody NoticeRequestDto noticeRequestDto){
        System.out.println("[Notice:CreateNotice] " + noticeRequestDto);

        return this.noticeService.CreateNotice(noticeRequestDto);
    }

    // 공지 조회
    @GetMapping("")
    public List<NoticeEntity> ReadNotice(){
        System.out.println("[Nocie:ReadNotice] ");
        return this.noticeService.ReadNotice();
    }

    // 공지 수정
    @PutMapping("/{id}")
    public ResponseEntity<NoticeEntity> UpdateNotice(@RequestBody NoticeEntity noticeEntity, @PathVariable String id){
        System.out.println("[Notice:UpdateNotice] " + noticeEntity);

        return this.noticeService.UpdateNotice(noticeEntity, id);
    }

    // 공지 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<NoticeEntity> DeleteNoticeById(@PathVariable String id){
        System.out.println("[Notice:DeleteNoticeById] "+id);

        return this.noticeService.DeleteNoticeById(id);
    }
}
