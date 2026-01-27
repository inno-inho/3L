package com.example.demo.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name="notice")
@EntityListeners(AuditingEntityListener.class)
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
    private String authorId; // 작성자 - user id와 관계 매핑해주기(ADMIN)

    private int viewCount; // 조회수

    private String isPinned; // 상단 고정 여부

    private String isImportant; // 중요 공지 여부

    // 시간은 Auditing 설정 없으면 동작 안함??
    @CreatedDate // 생성시점
    @Column(updatable = false)
    private LocalDateTime createdAt; // 작성 날짜

    @LastModifiedDate // 수정 날짜
    private LocalDateTime updatedAt; // 수정된 날짜

    @OneToMany(mappedBy="notice", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.LAZY)
    private List<NoticeFileEntity> files = new ArrayList<>();

    // 생성용 생성자
    public NoticeEntity(String title, String content, String authorId){
        this.title = title;
        this.content = content;
        this.authorId = authorId;
    }

    // 수정용 setter
    public void setTitle(String title){
        this.title = title;
    }
    public void setContent(String content){
        this.content = content;
    }
    public void setAuthorId(String authorId){
        this.authorId = authorId;
    }
}
