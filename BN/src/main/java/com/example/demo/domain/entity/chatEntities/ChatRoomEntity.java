package com.example.demo.domain.entity.chatEntities;

import com.example.demo.domain.dto.chatDto.ChatMessageDto;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomEntity {
    @Id
    private String roomId;

    private String roomName;

    @Enumerated(EnumType.STRING)
    private ChatMessageDto.ChatType chatRoomType;   // Group Or Friend

    private LocalDateTime createdAt;

    private String lastMessage;
    private LocalDateTime lastMessageTime;

}
