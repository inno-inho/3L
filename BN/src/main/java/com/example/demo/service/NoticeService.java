package com.example.demo.service;

import com.example.demo.domain.Repository.NoticeRepository;
import com.example.demo.domain.dto.NoticeRequestDto;
import com.example.demo.domain.dto.NoticeResponseDto;
import com.example.demo.domain.entity.NoticeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository){
        this.noticeRepository = noticeRepository;
    }

    // 공지 조회
    // List -> Pagenation 추가
    public Page<NoticeResponseDto> getAllNotices(Pageable pageable) {
        return noticeRepository.findAll(pageable)
                .map(NoticeResponseDto::from);
    }

    public NoticeEntity getNoticesById(Long id){
        return noticeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException());
    }

    // 공지 생성
    public NoticeEntity createNotice(NoticeRequestDto noticeRequest){
        // 클라이언트 요청 dto를 받아서 entity로 변환후 db에 저장
        NoticeEntity notice = new NoticeEntity(
                noticeRequest.getTitle(),
                noticeRequest.getContent(),
                noticeRequest.getAuthorId()
        );

        return noticeRepository.save(notice);
    }

    // 공지 수정
    public NoticeEntity updateNotice(Long id, NoticeRequestDto noticeRequest){
        NoticeEntity existNotice = getNoticesById(id); // 존재하는지 확인
        existNotice.setTitle(noticeRequest.getTitle());
        existNotice.setContent(noticeRequest.getContent());
        existNotice.setAuthorId(noticeRequest.getAuthorId());
        return noticeRepository.save(existNotice); // save는 entity를 반환

    }

    // 공지 삭제
    public void deleteNotice(Long id){
        noticeRepository.deleteById(id);
    }
}
