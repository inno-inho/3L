package com.example.demo.domain.Repository;


import com.example.demo.domain.entity.ChatEntities.ChatRoomMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMemberEntity, Long> {
    Optional<ChatRoomMemberEntity> findByRoomIdAndUserEmail(String roomId, String userEmail);
    List<ChatRoomMemberEntity> findByRoomIdAndActiveTrue(String roomId);

    boolean existsByRoomIdAndUserEmail(String roomId, String userEmail);

}
