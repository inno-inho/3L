package com.example.demo.service.chatServices;

import com.example.demo.domain.Repository.chatRepository.ChatMessageRepository;
import com.example.demo.domain.Repository.chatRepository.ChatRoomMemberRepository;
import com.example.demo.domain.dto.chatDto.ChatMessageDto;
import com.example.demo.domain.entity.chatEntities.ChatMessageEntity;
import com.example.demo.domain.entity.chatEntities.ChatRoomMemberEntity;
import com.example.demo.eventListener.ChatMessageEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;


// ##########################################################
// 참여자 관리와 입장/ 퇴장 등 채팅 룸에 관련한 서비스 클래스
// ##########################################################
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomMemberService {

    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final ChatCommonService chatCommonService;


    // ######################################
    // 채팅룸에 입장할 시
    // ######################################
    @Transactional
    public void joinRoom(String roomId, String userEmail) {
        saveMemberIfNotExists(roomId, userEmail);
        sendSystemMessage(roomId, userEmail, ChatMessageDto.MessageType.ENTER);
    }

    // 중복 입장 메시지 방지를 위한 공통 저장 로직
    private void saveMemberIfNotExists (String roomId, String userEmail) {

        Optional<ChatRoomMemberEntity> chatRoomMemberEntityOptional = chatRoomMemberRepository.findByRoomIdAndUserEmail(roomId, userEmail);

        // 처음 진입이거나 다시 들어온 경우
        if (chatRoomMemberEntityOptional.isEmpty()) {
            // 시스템 메시지 생성
            ChatRoomMemberEntity chatRoomMemberEntity = ChatRoomMemberEntity.builder()
                    .roomId(roomId)
                    .userEmail(userEmail)
                    .active(true)
                    .joinedAt(LocalDateTime.now())
                    .lastReadAt(LocalDateTime.now())
                    .build();
            chatRoomMemberRepository.save(chatRoomMemberEntity);
        } else {
            ChatRoomMemberEntity existingMember = chatRoomMemberEntityOptional.get();
            existingMember.activate();
            chatRoomMemberRepository.save(existingMember);
        }
    }

    // 메시지 없이 DB에 참여 정보만 저장
    @Transactional
    public void joinRoomWithoutMessage(String roomId, String userEmail) {
        saveMemberIfNotExists(roomId, userEmail);
        log.info("방 생성자 입장: {}", userEmail);
    }



    // ######################################
    // 채팅룸에서 퇴장할 시
    // ######################################
    @Transactional
    public void leaveRoom(String roomId, String userEmail) {
        chatRoomMemberRepository.findByRoomIdAndUserEmail(roomId, userEmail).ifPresent(member -> {
            // 멤버 삭제
            chatRoomMemberRepository.delete(member);

            log.info("채팅방 퇴장: {}에서 {}가 퇴장함", roomId, userEmail);

            sendSystemMessage(roomId, userEmail, ChatMessageDto.MessageType.QUIT);
        });
    }

    // ###############################################
    // 공통 시스템 메시지 전송 로직
    // ###############################################
    private void sendSystemMessage(String roomId, String userEmail, ChatMessageDto.MessageType messageType) {

        // 메시지 엔티티 생성 및 저장
        ChatMessageEntity chatMessageEntity = ChatMessageEntity.builder()
                .roomId(roomId)
                .sender(userEmail)
                .senderName(chatCommonService.resolveSenderName(userEmail))
                .messageType(messageType)
                .createdAt(LocalDateTime.now())
                .files(new ArrayList<>())
                .build();
        chatMessageRepository.save(chatMessageEntity);

        applicationEventPublisher.publishEvent(new ChatMessageEvent(roomId, chatCommonService.convertToDto(chatMessageEntity)));

    }

}
