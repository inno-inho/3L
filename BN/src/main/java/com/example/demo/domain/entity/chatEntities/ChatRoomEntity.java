package com.example.demo.domain.entity.chatEntities;

import com.example.demo.domain.dto.chatDto.ChatMessageDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.List;

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

    @ElementCollection // 이게 없으면 List<String>을 DB에 저장하지 못함
    @CollectionTable(name = "chat_room_images", joinColumns = @JoinColumn(name = "room_id"))
    private List<String> roomImageUrls;

}
