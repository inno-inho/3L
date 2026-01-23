package com.example.demo.service.chatServices;

import com.example.demo.domain.dto.ChatMessageDto;
import com.example.demo.domain.entity.ChatEntities.ChatMessageEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ChatCommonService {

    // 정규식 패턴 (URL 추출용)
    private static final String URL_REGEX = "https?://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";


    // ###############################
    // Entity에서 Dto 변환
    // ###############################
    public ChatMessageDto convertToDto(ChatMessageEntity chatMessageEntity) {
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
                .parentMessageId(chatMessageEntity.getParentMessageId() != null ? String.valueOf(chatMessageEntity.getParentMessageId()) : null)
                .parentMessageSenderName(chatMessageEntity.getParentMessageSenderName())
                .parentMessageContent(chatMessageEntity.getParentMessageContent())
                .createdAt(chatMessageEntity.getCreatedAt())
                .build();

        // 작성한 시간 포맷팅 메서드 호출
        chatMessageDto.setSentTimeFromCreatedAt();
        return chatMessageDto;
    }

    // ##############################################
    // 메시지 들어오는 거에 따라 타입 나누기
    // ##############################################
    public ChatMessageDto.MessageType determineMessageType(List<MultipartFile> files) {
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
    public String extractOnlyOneUrl(String content) {
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

    // ###################################
    // 메타데이터 생성
    // ###################################
    public ChatMessageDto.ChatMetadata buildUrlMetadata(String message) {
        // 딱 하나만 있는 URL 추출
        String url = extractOnlyOneUrl(message);

        // URL이 없거나 여러 개면 바로 null 리턴
        if (url == null) return null;

        try {

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


}
