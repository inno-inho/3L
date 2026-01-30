package com.example.demo.domain.Repository;

import com.example.demo.domain.entity.NoticeFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeFileRepository extends JpaRepository<NoticeFileEntity, Long> {
    List<NoticeFileEntity> findByNoticeId(Long noticeId);
}
