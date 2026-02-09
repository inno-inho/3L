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
        Optional<ChatRoomMemberEntity> chatRoomMemberEntityOptional = chatRoomMemberRepository.findByRoomIdAndUserEmail(roomId, userEmail);

        // 처음 진입이거나 다시 들어온 경우
        if (chatRoomMemberEntityOptional.isEmpty() || !chatRoomMemberEntityOptional.get().isActive()) {
            // 시스템 메시지 생성
            ChatRoomMemberEntity enterMessage = ChatRoomMemberEntity.builder()
                    .roomId(roomId)
                    .userEmail(userEmail)
                    .active(true)
                    .joinedAt(LocalDateTime.now())
                    .lastReadAt(LocalDateTime.now())
                    .build();
            chatRoomMemberRepository.save(enterMessage);
        } else {
            chatRoomMemberEntityOptional.get().activate();
            chatRoomMemberEntityOptional.get().setLastReadAt(LocalDateTime.now());
        }

        log.info("채팅방 입장: {}에 {}가 입장함", roomId, userEmail);
        // 입장 시스템 메시지 생성 및 발행
        sendSystemMessage(roomId, userEmail, ChatMessageDto.MessageType.ENTER);
    }




    // ######################################
    // 채팅룸에서 퇴장할 시
    // ######################################
    @Transactional
    public void leaveRoom(String roomId, String userEmail) {
        chatRoomMemberRepository.findByRoomIdAndUserEmail(roomId, userEmail).ifPresent(member -> {
            member.deactivate();

            log.info("채팅방 퇴장: {}에서 {}가 퇴장함", roomId, userEmail);

            sendSystemMessage(roomId, userEmail, ChatMessageDto.MessageType.QUIT);
        });
    }

    // #####################################
    // 채팅방에 유저 초대할 시
    // #####################################
    @Transactional
    public void inviteUser(String roomId, String inviteeEmail) {
        if (!chatRoomMemberRepository.existsByRoomIdAndUserEmail(roomId, inviteeEmail)) {
            chatRoomMemberRepository.save(ChatRoomMemberEntity.builder()
                    .roomId(roomId)
                    .userEmail(inviteeEmail)
                    .active(true)
                    .joinedAt(LocalDateTime.now())
                    .lastReadAt(LocalDateTime.now())
                    .build());
        }

        log.info("채팅방으로 초대: {}으로 {}가 초대 받음, ChatRoomService", roomId, inviteeEmail);
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
