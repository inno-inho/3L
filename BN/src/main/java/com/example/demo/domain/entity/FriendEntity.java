package com.example.demo.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "friends")
public class FriendEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 친구 신청을 보낸 사람
    @Column(nullable = false)
    private String requesterEmail;

    // 신청을 받은 사람
    @Column(nullable = false)
    private String friendEmail;

    // 상태관리( PENDING, ACCEPTED, REJECTED )
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendStatus friendStatus;

    // 차단을 실행한 사람의 이메일
    private String blockedBy;

    // 친구 요청 보낸 시간
    private LocalDateTime createdAt;

    // 수락 시 시간 기록용
    private LocalDateTime acceptedAt;

    // @PrePersist란 엔티티가 DB에 저장되기 직전에 자동으로 실행되는 메서드에 붙이는 어노테이션
    // 그러니까 여기서는 DB에 저장되기 직전에 요청 시간을 createdAt에 저장하고, 기본값을 친구요청 대기상태로 만든다
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.friendStatus == null) {
            this.friendStatus = FriendStatus.PENDING;
        }
    }
}
