package com.example.demo.service;

import com.example.demo.domain.Repository.NoticeFileRepository;
import com.example.demo.domain.Repository.NoticeRepository;
import com.example.demo.domain.dto.NoticeRequestDto;
import com.example.demo.domain.dto.NoticeResponseDto;
import com.example.demo.domain.entity.NoticeEntity;
import com.example.demo.domain.entity.NoticeFileEntity;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor // @Autowired 없이
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final NoticeFileService noticeFileService;

    // 공지 조회
    // List -> Pagenation 추가
    // 검색 분기 처리 추가(Repository에서 Entity만 반환하므로 Service에서 DTO로 변환해줘야함)
    @Transactional(readOnly = true)
    public Page<NoticeResponseDto> getAllNotices(String keyword, Pageable pageable) {
        // 검색어가 없는 경우
        if (keyword == null || keyword.isBlank()){
            return noticeRepository.findAll(pageable)
                    .map(NoticeResponseDto::from);
        }
        // 검색어가 있는 경우
        return noticeRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable)
                .map(NoticeResponseDto::from);
    }

    // 공지 상세 조회 - DTO를 반환하는 상세조회
    // 프론트에 내려주는 용도
    @Transactional(readOnly = true)
    public NoticeResponseDto getNoticesById(Long id){
        NoticeEntity entity = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("공지 없음"));
        return NoticeResponseDto.from(entity);
    }

    // 공지 상세 조회 - Entity를 반환하는 상세 조회
    @Transactional
    public NoticeEntity getNoticeEntity(Long id){
        return noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지 없음"));
    }

    // 공지 수정
    @Transactional
    public NoticeResponseDto updateNotice(
            Long id,
            NoticeRequestDto noticeRequest,
            List<MultipartFile> files,
            List<Long> deleteFileIds
    ){
        NoticeEntity existNotice = getNoticeEntity(id); // 존재하는지 확인(getNoticeById에서는 DTO를 반환)
        existNotice.setTitle(noticeRequest.getTitle());
        existNotice.setContent(noticeRequest.getContent());
//        existNotice.setAuthorId(noticeRequest.getAuthorId()); // 공지 작성자는 보통 불변이므로 제거하는게 좋음(생성시에만 설정)

        // 기존 파일 삭제
        if (deleteFileIds != null && !deleteFileIds.isEmpty()){
            noticeFileService.deleteFiles(deleteFileIds);
        }
        // 새 파일 추가
        if (files != null && !files.isEmpty()){
            noticeFileService.saveFiles(existNotice, files);
        }
        return NoticeResponseDto.from(existNotice);

    }

    // 공지 생성
    @Transactional // 실패 시 롤백, DB 기준 정합성 유지되도록
    public NoticeEntity createNotice(
            NoticeRequestDto noticeRequest,
            List<MultipartFile> files
    ){
        // 1. 공지 저장
        // 클라이언트 요청 dto를 받아서 entity로 변환후 db에 저장
        NoticeEntity notice = noticeRepository.save(
                new NoticeEntity(
                        noticeRequest.getTitle(),
                        noticeRequest.getContent(),
                        noticeRequest.getAuthorId()
                )
        );
        // 2. 파일 저장은 NoticeFileService로
        noticeFileService.saveFiles(notice, files);

        return notice;
    }



    // 공지 삭제
    public void deleteNotice(Long id){
        noticeRepository.deleteById(id);
    }
}
