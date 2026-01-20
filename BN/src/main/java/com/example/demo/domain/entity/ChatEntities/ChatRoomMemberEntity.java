// #################################################
// 참여자와 방의 관계를 관리하는 엔티티
// #################################################

package com.example.demo.domain.entity.ChatEntities;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ChatRoomMemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomId;
    private String userEmail;

    // 처음 입장 시각 (ENTER 메시지 발생 기준)
    private LocalDateTime joinedAt;

    // 현재 방에 참여 중인지 여부 (나가기 버튼 누르면 false)
    private boolean active;

    public void activate() {
        this.active = true;
        this.joinedAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.active = false;
    }
}
