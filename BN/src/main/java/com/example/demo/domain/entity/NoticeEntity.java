package com.example.demo.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name="notice")
public class NoticeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="notice_id")
    private Long id;

    @Column(nullable=false)
    private String title; // 제목

    @Column(columnDefinition = "TEXT")
    private String content; // 내용

//    @ManyToOne(cascade = CascadeType.MERGE, targetEntity = User.class)
//    @JoinColumn(name="user_id", updatable=false)
    private String author_id; // 작성자 - 회원 id와 관계 매핑해주기(ADMIN)

    private String view_count; // 조회수

    private String is_pinned; // 상단 고정 여부

    private String is_important; // 중요 공지 여부

    @CreatedDate
    private LocalDateTime created_at; // 작성 날짜

    @CreatedDate
    private LocalDateTime updated_at; // 수정된 날짜
}
