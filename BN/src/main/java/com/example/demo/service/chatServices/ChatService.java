package com.example.demo.service.chatServices;

import com.example.demo.domain.Repository.ChatMessageRepository;
import com.example.demo.domain.Repository.Local_S3_FileService.FileService;
import com.example.demo.domain.dto.ChatMessageDto;
import com.example.demo.domain.dto.ChatMessageRequestDto;
import com.example.demo.domain.entity.ChatEntities.ChatMessageEntity;
import com.example.demo.domain.entity.ChatEntities.ChatMessageFileEntity;
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
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final FileService fileService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApplicationEventPublisher applicationEventPublisher;      // 방송국 역할

    // 정규식 패턴 (URL 추출용)
    private static final String URL_REGEX = "https?://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";

    private ChatMessageDto convertToDto(ChatMessageEntity chatMessageEntity) {
        // 자식 엔티티 리스트에서 fileUrl 필드만 추출하여 List<String>으로 변환
        List<ChatMessageDto.FileResponse> fileResponses = chatMessageEntity.getFiles().stream()
                .map(f -> ChatMessageDto.FileResponse.builder()
                        .fileUrl(f.getFileUrl())
                        .fileName(f.getFileUrl().substring(f.getFileUrl().lastIndexOf("/") + 1))    // URL에서 파일명만 추출
                        .originalFileName(f.getOriginalFileName())      // 엔티티에 저장된 원본 이름을 DTO 세팅
                        .build()
                )     // 각 파일 엔티티에서 URL과 파일 이름 추출
                .toList();

        // 빌더를 통해서 DTO 생성 및 매핑
        ChatMessageDto chatMessageDto = ChatMessageDto.builder()
                .messageId(String.valueOf(chatMessageEntity.getMessageId()))    // Long타입으로 저장된 messageId가 String으로 바뀌어서 Dto에 담김
                .messageType(chatMessageEntity.getMessageType() != null ? chatMessageEntity.getMessageType() : ChatMessageDto.MessageType.TEXT) // 기본값 설정
                .roomId(chatMessageEntity.getRoomId())
                .sender(chatMessageEntity.getSender())
                .senderName(chatMessageEntity.getSender()) // 우선 이메일을 이름으로 세팅 (유저 기능 연동 전까지)
                .message(chatMessageEntity.getMessage())
                .files(fileResponses)
                .metadata(chatMessageEntity.getMetadata())
                .createdAt(chatMessageEntity.getCreatedAt())
                .build();

        // 작성한 시간 포맷팅 메서드 호출
        chatMessageDto.setSentTimeFromCreatedAt();
        return chatMessageDto;
    }

    // ##############################################
    // 메시지 들어오는 거에 따라 타입 나누기
    // ##############################################
    private ChatMessageDto.MessageType determineMessageType(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return ChatMessageDto.MessageType.TEXT;

        MultipartFile firstFile = files.get(0);
        String contentType = firstFile.getContentType();    // 예: "image/png", "video/mp4", "application/pdf"
        String fileName = firstFile.getOriginalFilename() != null ?
                        firstFile.getOriginalFilename().toLowerCase() : "";

        if (contentType != null){
            if (contentType.startsWith("image")) return ChatMessageDto.MessageType.IMAGE;
            if (contentType.startsWith("video")) return ChatMessageDto.MessageType.VIDEO;
            if (contentType.startsWith("audio")) return ChatMessageDto.MessageType.FILE;
        }

        // MIME 타입으로 판별이 안 되는 특수 확장자들 추가 체크
        if (fileName.endsWith(".pdf") || fileName.endsWith(".zip") ||
            fileName.endsWith(".docx") || fileName.endsWith(".xlsx")) {
            return ChatMessageDto.MessageType.FILE;
        }

        return ChatMessageDto.MessageType.FILE; // 파일이 있다면 기본값으로 FILE
    }

    // ####################################
    // URL 추출
    // ####################################
    private String extractOnlyOneUrl(String content) {
        if (content == null || content.isEmpty()) return null;

        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(URL_REGEX);
        java.util.regex.Matcher matcher = pattern.matcher(content);

        List<String> urls = new ArrayList<>();
        while (matcher.find()) {
            urls.add(matcher.group());
        }

        // URL이 정확히 딱 1개 있을 때만 해당 URL 반환
        if (urls.size() == 1) {
            return urls.get(0);
        }

        // 0개거나 2개 이상이면 null -> 썸네일 안 보여줌
        return null;
    }

    // 메타데이터 생성
    private ChatMessageDto.ChatMetadata buildUrlMetadata(String message) {
        try {
            // 딱 하나만 있는 URL 추출
            String url = extractOnlyOneUrl(message);

            // URL이 없거나 여러 개면 바로 null 리턴
            if (url == null) return null;

            // 실제 Jsoup 연결 (Timeout 설정 권장)
            org.jsoup.nodes.Document doc = org.jsoup.Jsoup.connect(url) // 클래스명 Jsoup 추가
                    .timeout(3000)
                    .get();

            // OpenGraph 메타 태그 추출
            String title = doc.select("meta[property=og:title]").attr("content");
            if (title.isEmpty()) title = doc.title(); // og:title 없으면 기본 <title>

            String description = doc.select("meta[property=og:description]").attr("content");
            String image = doc.select("meta[property=og:image]").attr("content");

            return ChatMessageDto.ChatMetadata.builder()
                    .url(url)
                    .ogTitle(title)
                    .ogDescription(description)
                    .ogImage(image)
                    .build();
        } catch (Exception e) {
            log.error("메타데이터 추출 실패: {}", e.getMessage());
            return null;
        }
    }


    // ####################################
    // 채팅 메시지 저장
    // ####################################
    @Transactional
    public ChatMessageDto saveMessage(ChatMessageRequestDto chatMessageRequestDto) {

        ChatMessageDto.MessageType determinedType;
        ChatMessageDto.ChatMetadata chatMetadata = null;    // 메타데이터 변수 초기화

        // 우선 DTO에 담겨온 타입을 확인 (프론트에서 ENTER/QUIT를 명시해서 보낼 경우)
        if (chatMessageRequestDto.getMessageType() != null &&
                (chatMessageRequestDto.getMessageType() == ChatMessageDto.MessageType.ENTER ||
                        chatMessageRequestDto.getMessageType() == ChatMessageDto.MessageType.QUIT)) {
            determinedType = chatMessageRequestDto.getMessageType();
        }

        // 파일이 있는 경우(IMAGE, FILE, VIDEO)
        else if (chatMessageRequestDto.getFiles() != null && !chatMessageRequestDto.getFiles().isEmpty()) {
            determinedType = determineMessageType(chatMessageRequestDto.getFiles());
        } else {
            String singleUrl = extractOnlyOneUrl(chatMessageRequestDto.getMessage());
            if (singleUrl != null) { // 파일은 없는데 URL이 딱 하나 포함된 경우
                determinedType = ChatMessageDto.MessageType.URL_LINK;
                chatMetadata = buildUrlMetadata(chatMessageRequestDto.getMessage());    // 여기서 JSOUP 작동
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
                .message(chatMessageRequestDto.getMessage())
                .messageType(determinedType)
                .metadata(chatMetadata) // 추출된 메타데이터 객체를 그대로 넣으면 컨버터가 알아서 JSON으로 변환함
                .createdAt(LocalDateTime.now())
                .files(new ArrayList<>())
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

        // Entity를 Dto로 변환
        ChatMessageDto savedDto = convertToDto(chatMessageEntity);

        log.info("이벤트 발행 직전: {}" , savedDto.getMessage());
        // 이벤트 발행 (하지만 아직 리스너가 실행되지는 않음. 커밋될 때까지 대기)
        applicationEventPublisher.publishEvent(new ChatMessageEvent(chatMessageRequestDto.getRoomId(), savedDto));
        log.info("이벤트 발행 완료");

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










}
