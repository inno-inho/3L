package com.example.demo.service;

import com.example.demo.domain.Repository.ChatMessageRepository;
import com.example.demo.domain.Repository.Local_S3_FileService.FileService;
import com.example.demo.domain.dto.ChatMessageDto;
import com.example.demo.domain.dto.ChatMessageRequestDto;
import com.example.demo.domain.entity.ChatMessageEntity;
import com.example.demo.domain.entity.ChatMessageFileEntity;
import com.example.demo.eventListener.ChatMessageEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final FileService fileService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApplicationEventPublisher applicationEventPublisher;

    // ####################################
    // 채팅 메시지 저장
    // ####################################
    @Transactional
    public ChatMessageDto saveMessage(ChatMessageRequestDto chatMessageRequestDto) {

        ChatMessageEntity chatMessageEntity = ChatMessageEntity.builder()
                .roomId(chatMessageRequestDto.getRoomId())
                .sender(chatMessageRequestDto.getSender())
                .message(chatMessageRequestDto.getMessage())
                .messageType(chatMessageRequestDto.getMessageType())
                .createdAt(LocalDateTime.now())
                .files(new ArrayList<>())
                .build();

        // 파일이 있으면 업로드 후 자식 엔티티 생성 및 관계 설정
        if (chatMessageRequestDto.getFiles() != null && !chatMessageRequestDto.getFiles().isEmpty()) {
            for (MultipartFile multipartFile : chatMessageRequestDto.getFiles()) {
                String url = fileService.uploadFile(multipartFile);

                ChatMessageFileEntity chatMessageFileEntity = ChatMessageFileEntity.builder()
                        .fileUrl(url)
                        .chatMessage(chatMessageEntity)     // 부모인 ChatMessageEntity 연결
                        .build();

                // 부모 엔티티의 리스트에 추가해줘야 Cascade가 작동함
                chatMessageEntity.getFiles().add(chatMessageFileEntity);
            }
        }

        // DB 저장(Cascade 설정 덕분에 파일들도 함께 저장됨)
        chatMessageRepository.save(chatMessageEntity);

        // Entity를 Dto로 변환
        ChatMessageDto savedDto = convertToDto(chatMessageEntity);

        // 이벤트 발행 (하지만 아직 리스너가 실행되지는 않음. 커밋될 때까지 대기)
        applicationEventPublisher.publishEvent(new ChatMessageEvent(chatMessageRequestDto.getRoomId(), savedDto));

        // Redis에는 변환된 Dto를 저장
        String redisKey = "chatroom:last_msg:" + chatMessageRequestDto.getRoomId();
        redisTemplate.opsForValue().set(redisKey, savedDto);

        return savedDto;
    }

    // ####################################
    // 채팅내역 불러오기
    // ####################################
    @Transactional(readOnly = true)
    public List<ChatMessageDto> getChatHistory(String roomId, Long lastMessageId, int size) {
        PageRequest pageRequest = PageRequest.of(0, size);  // Page는 항상 0으로 고정

        List<ChatMessageEntity> chatMessageEntities;
        if (lastMessageId == null){
            // 처음 방 진입 시(가장 최근 메시지 가져오기)
            chatMessageEntities = chatMessageRepository.findByRoomIdOrderByMessageIdDesc(roomId, pageRequest);
        } else {
            // 스크롤을 올려서 이전 내역 요청 시 (lastMessageId 기준 이전 데이터)
            chatMessageEntities = chatMessageRepository.findByRoomIdAndMessageIdLessThanOrderByMessageIdDesc(roomId, lastMessageId, pageRequest);
        }

        return chatMessageEntities.stream()
                .map(this::convertToDto)
                .toList();
    }

    private ChatMessageDto convertToDto(ChatMessageEntity chatMessageEntity) {
        // 자식 엔티티 리스트에서 fileUrl 필드만 추출하여 List<String>으로 변환
        List<String> urls = chatMessageEntity.getFiles().stream()
                .map(ChatMessageFileEntity::getFileUrl)     // 각 파일 엔티티에서 URL 추출
                .toList();

        // 빌더를 통해서 DTO 생성 및 매핑
        ChatMessageDto chatMessageDto = ChatMessageDto.builder()
                .messageId(String.valueOf(chatMessageEntity.getMessageId()))    // Long타입으로 저장된 messageId가 String으로 바뀌어서 Dto에 담김
                .messageType(chatMessageEntity.getMessageType())
                .roomId(chatMessageEntity.getRoomId())
                .sender(chatMessageEntity.getSender())
                .message(chatMessageEntity.getMessage())
                .fileUrls(urls)
                .createdAt(chatMessageEntity.getCreatedAt())
                .build();

        // 작성한 시간 포맷팅 메서드 호출
        chatMessageDto.setSentTimeFromCreatedAt();
        return chatMessageDto;
    }








}
