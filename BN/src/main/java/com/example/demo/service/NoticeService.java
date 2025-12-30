package com.example.demo.service;

import com.example.demo.domain.Repository.NoticeRepository;
import com.example.demo.domain.entity.NoticeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;


    // 공지 조회
    public List<NoticeEntity> GetNotices(){
        return this.noticeRepository.findAll();
    }

    // 공지 생성


    // 공지 수정

    // 공지 삭제
}
