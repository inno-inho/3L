package com.example.demo.domain.entity;

import com.example.demo.domain.dto.ChatMessageDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_message")
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    private String roomId;
    private String sender;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private ChatMessageDto.MessageType messageType;

    private String fileUrl;

    @CreatedDate
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "chatMessage", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default        // builder 사용 시 리스트 초기화 보장하는 옵션 Default
    private List<ChatMessageFileEntity> files = new ArrayList<>();

    // 파일 리스트를 추가할 때 연관관계를 자종으로 설정
    public void addFile(ChatMessageFileEntity chatMessageFileEntity) {
        this.files.add(chatMessageFileEntity);
        chatMessageFileEntity.setChatMessage(this);
    }
}
