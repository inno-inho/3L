package com.example.demo.domain.Repository.chatRepository;


import com.example.demo.domain.entity.chatEntities.ChatRoomMemberEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMemberEntity, Long> {
    // 입장 퇴장용
    Optional<ChatRoomMemberEntity> findByRoomIdAndUserEmail(String roomId, String userEmail);

    List<ChatRoomMemberEntity> findByRoomIdAndActiveTrue(String roomId);

    // 사용자가 참여 중인 모든 방 멤버 정보 가져오기
    List<ChatRoomMemberEntity> findByUserEmailAndActiveTrue(String userEmail);

    // 특정 방의 현재 참여 인원수 계산
    int countByRoomIdAndActiveTrue(String roomId);

    // 초대할 때 이미 있는 멤버인지 확인하는거
    boolean existsByRoomIdAndUserEmail(String roomId, String userEmail);

    // 1:1 채팅 시상대방 정보 가져오기
    @Query("SELECT m FROM ChatRoomMemberEntity m WHERE m.roomId = :roomId AND m.userEmail != :userEmail")
    Optional<ChatRoomMemberEntity> findOpponent(
            @Param("roomId") String roomId,
            @Param("userEmail") String userEmail
            );
}
