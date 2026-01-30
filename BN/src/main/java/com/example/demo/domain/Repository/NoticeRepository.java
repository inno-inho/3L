package com.example.demo.domain.Repository;

import com.example.demo.domain.dto.NoticeResponseDto;
import com.example.demo.domain.entity.NoticeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<NoticeEntity, Long> {
    // 검색창 구현시 추가
    // SELECT * FROM notice WHERE title LIKE '%keyword%' OR content LIKE '%keyword%' 와 동일한 의미
    Page<NoticeEntity> findByTitleContainingOrContentContaining(
            String title,
            String content,
            Pageable pageable // LIMIT, OFFSET, ORDER BY 까지 같이 처리
    );
}
