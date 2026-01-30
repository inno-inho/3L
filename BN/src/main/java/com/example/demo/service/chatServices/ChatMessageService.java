package com.example.demo.service.chatServices;

import com.example.demo.domain.Repository.chatRepository.ChatMessageRepository;
import com.example.demo.domain.Repository.Local_S3_FileService.FileService;
import com.example.demo.domain.Repository.chatRepository.ChatRoomRepository;
import com.example.demo.domain.dto.chatDto.ChatMessageDto;
import com.example.demo.domain.dto.chatDto.ChatMessageRequestDto;
import com.example.demo.domain.entity.chatEntities.ChatMessageEntity;
import com.example.demo.domain.entity.chatEntities.ChatMessageFileEntity;
import com.example.demo.domain.entity.chatEntities.ChatRoomEntity;
import com.example.demo.eventListener.ChatMessageEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final FileService fileService;
    private final ChatCommonService chatCommonService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApplicationEventPublisher applicationEventPublisher;      // 방송국 역할
    private final ChatRoomRepository chatRoomRepository;


    // ####################################
    // 채팅 메시지 저장
    // ####################################
    @Transactional
    public ChatMessageDto saveMessage(ChatMessageRequestDto chatMessageRequestDto) {

        ChatMessageDto.MessageType determinedType;
        ChatMessageDto.ChatMetadata chatMetadata = null;    // 메타데이터 변수 초기화

        if (chatMessageRequestDto.getFiles() != null && !chatMessageRequestDto.getFiles().isEmpty()) {
            // 파일이 있는 경우
            determinedType = chatCommonService.determineMessageType(chatMessageRequestDto.getFiles());
        } else {
            // URL 체크
            String singleUrl = chatCommonService.extractOnlyOneUrl(chatMessageRequestDto.getMessage());

            if (singleUrl != null) { // 파일은 없는데 URL이 딱 하나 포함된 경우
                determinedType = ChatMessageDto.MessageType.URL_LINK;
                chatMetadata = chatCommonService.buildUrlMetadata(chatMessageRequestDto.getMessage());    // 여기서 JSOUP 작동
            } else if (chatMessageRequestDto.getMessageType() != null) {    // Enter, Quit 등 수동 지정타입
                determinedType = chatMessageRequestDto.getMessageType();
            } else {    // 일반 텍스트
                determinedType = ChatMessageDto.MessageType.TEXT;
            }
        }

        // 엔티티 생성
        ChatMessageEntity chatMessageEntity = ChatMessageEntity.builder()
                .roomId(chatMessageRequestDto.getRoomId())
                .sender(chatMessageRequestDto.getSender())
                .senderName(chatCommonService.resolveSenderName(chatMessageRequestDto.getSender()))
                .message(chatMessageRequestDto.getMessage())
                .messageType(determinedType)
                .metadata(chatMetadata) // 추출된 메타데이터 객체를 그대로 넣으면 컨버터가 알아서 JSON으로 변환함
                .createdAt(LocalDateTime.now())
                .files(new ArrayList<>())
                .parentMessageId(chatMessageRequestDto.getParentMessageId())
                .parentMessageSenderName(chatMessageRequestDto.getParentMessageSenderName())
                .parentMessageContent(chatMessageRequestDto.getParentMessageContent())
                .build();

        // 파일이 있으면 업로드 후 자식 엔티티 생성 및 관계 설정
        if (chatMessageRequestDto.getFiles() != null && !chatMessageRequestDto.getFiles().isEmpty()) {
            for (MultipartFile multipartFile : chatMessageRequestDto.getFiles()) {
                String url = fileService.uploadFile(multipartFile);
                String originalName = multipartFile.getOriginalFilename();  // 원본 이름 추출

                // 부모 엔티티의 fileUrl 컬럼에 첫 번째 파일 주소 넣기
                if (chatMessageEntity.getFileUrl() == null) {
                    chatMessageEntity.setFileUrl(url);
                }

                ChatMessageFileEntity chatMessageFileEntity = ChatMessageFileEntity.builder()
                        .fileUrl(url)
                        .originalFileName(originalName)     // 원본 이름 저장(프론트엔드 채팅창에서 파일 메시지 보낼 시 파일이름만 보이게 할려고)
                        .chatMessage(chatMessageEntity)     // 부모인 ChatMessageEntity 연결
                        .build();

                // 부모 엔티티의 리스트에 추가해줘야 Cascade가 작동함
                chatMessageEntity.getFiles().add(chatMessageFileEntity);
            }
        }

        // DB 저장(Cascade 설정 덕분에 파일들도 함께 저장됨)
        chatMessageRepository.save(chatMessageEntity);

        // 채팅방의 마지막 메시지 정보 업데이트
        ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(chatMessageRequestDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("방을 찾을 수 없습니다."));

        // 마지막 메시지 텍스트 결정 (누군가가 보낸 마지막 메시지)
        String lastMessage = chatMessageEntity.getMessage();
        if (chatMessageEntity.getMessageType() == ChatMessageDto.MessageType.IMAGE) {
            lastMessage = "사진을 보냈습니다.";
        } else if (chatMessageEntity.getMessageType() == ChatMessageDto.MessageType.FILE) {
            lastMessage = "파일을 보냈습니다." ;
        }

        chatRoomEntity.setLastMessage(lastMessage);
        chatRoomEntity.setLastMessageTime(chatMessageEntity.getCreatedAt());
        // JPA의 dirty Checking으로 인해 따로 save하지 않아도 트랜잭션 종료 시 업데이트됨
        // Dirty Checking? JPA는 트랜잭션 안에서 엔티티를 조회하면 그 엔티티를 영속 상태로 관리.
        // 처음 조회했을 때 스냅샷 저장 하고 이후 값아 바뀌었는지 계속해서 추적하기 때문에
        // chatRoomRepository.save(chatRoomEntity); 를 써서 다시 저장 할 필요는 없음


        // Entity를 Dto로 변환
        ChatMessageDto savedDto = chatCommonService.convertToDto(chatMessageEntity);

        log.info("메시지 저장 이벤트 발행 직전: {}" , savedDto.getMessage());
        // 이벤트 발행 (하지만 아직 리스너가 실행되지는 않음. 커밋될 때까지 대기)
        applicationEventPublisher.publishEvent(new ChatMessageEvent(chatMessageRequestDto.getRoomId(), savedDto));
        log.info("메시지 저장 이벤트 발행 완료: {}", savedDto.getMessage());

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
                .map(chatCommonService::convertToDto)
                .toList();
    }

    // ############################################
    // 채팅 삭제
    // ############################################
    @Transactional
    public ChatMessageDto deleteMessage(Long messageId, String userEmail) {
        ChatMessageEntity chatMessageEntity = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("메시지를 찾을 수 없습니다. ChatService_deleteMessage"));

        // 본인 확인 로직
        if (!chatMessageEntity.getSender().equals(userEmail)) {
            throw new RuntimeException("본인의 메시지만 삭제할 수 있습니다. ChatService의 deleteMessage");
        }

        log.info("채팅 메시지 삭제 이벤트: {},  ChatService", chatMessageEntity.getMessage());

        // 상태 변경
        chatMessageEntity.setMessageType(ChatMessageDto.MessageType.DELETE);
        chatMessageEntity.setMessage("삭제된 메시지입니다");

        ChatMessageDto chatMessageDto = chatCommonService.convertToDto(chatMessageEntity);

        // 실시간 알림 발행(구독 중인 모든 유저의 화면에서 사라지게 함)
        applicationEventPublisher.publishEvent(new ChatMessageEvent(chatMessageEntity.getRoomId(), chatMessageDto));



        return null;
    }



}
