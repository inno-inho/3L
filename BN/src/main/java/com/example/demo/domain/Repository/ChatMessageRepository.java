package com.example.demo.domain.Repository;

import com.example.demo.domain.dto.ChatMessageDto;
import com.example.demo.domain.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    // 처음 입장 시 최신 내역 가져오기
    List<ChatMessageEntity> findByRoomIdOrderByMessageIdDesc(String roomId, Pageable pageable);

    // 스크롤 시 특정 ID보다 작은 메시지들을 가져오는 로직(최신순)
    List<ChatMessageEntity> findByRoomIdAndMessageIdLessThanOrderByMessageIdDesc (String roomId, Long lastMessageId, Pageable pageable);

}
