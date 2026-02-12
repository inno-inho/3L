package com.example.demo.domain.Repository.chatRepository;

import com.example.demo.domain.entity.chatEntities.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, String> {

}
