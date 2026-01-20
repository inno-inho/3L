package com.example.demo.service.chatServices;

import com.example.demo.domain.Repository.ChatMessageRepository;
import com.example.demo.domain.Repository.ChatRoomMemberRepository;
import com.example.demo.domain.dto.ChatMessageDto;
import com.example.demo.domain.entity.ChatEntities.ChatMessageEntity;
import com.example.demo.domain.entity.ChatEntities.ChatRoomMemberEntity;
import com.example.demo.eventListener.ChatMessageEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Repository;
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
public class ChatRoomService {

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
            ChatMessageEntity enterMessage = ChatMessageEntity.builder()
                    .roomId(roomId)
                    .sender(userEmail)
                    .messageType(ChatMessageDto.MessageType.ENTER)  // 여기서 메시지타입을 Enter로 해줌
                    .createdAt(LocalDateTime.now())
                    .files(new ArrayList<>())
                    .build();
            chatMessageRepository.save(enterMessage);

            // 참여자 테이블 업데이트
            if (chatRoomMemberEntityOptional.isEmpty()) {
                chatRoomMemberRepository.save(ChatRoomMemberEntity.builder()
                        .roomId(roomId)
                        .userEmail(userEmail)
                        .active(true)
                        .joinedAt(LocalDateTime.now())
                        .build());
            } else {
                chatRoomMemberEntityOptional.get().activate();
            }
            log.info("채팅방 입장: {}에서 {}가 입장함 ChatRoomService", roomId, userEmail);

            // DTO 변환 후 이벤트 발행
            applicationEventPublisher.publishEvent(new ChatMessageEvent(roomId, chatCommonService.convertToDto(enterMessage)));
        }
    }


    // ######################################
    // 채팅룸에서 퇴장할 시
    // ######################################
    @Transactional
    public void leaveRoom(String roomId, String userEmail) {
        chatRoomMemberRepository.findByRoomIdAndUserEmail(roomId, userEmail).ifPresent(member -> {
            member.deactivate();

            ChatMessageEntity quitMessage = ChatMessageEntity.builder()
                    .roomId(roomId)
                    .sender(userEmail)
                    .messageType(ChatMessageDto.MessageType.QUIT)
                    .createdAt(LocalDateTime.now())
                    .files(new ArrayList<>())
                    .build();
            chatMessageRepository.save(quitMessage);

            log.info("채팅방 퇴장: {}에서 {}가 퇴장함", roomId, userEmail);

            applicationEventPublisher.publishEvent(new ChatMessageEvent(roomId, chatCommonService.convertToDto(quitMessage)));
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
                    .active(false)
                    .build());
        }

        log.info("채팅방으로 초대: {}으로 {}가 초대 받음, ChatRoomService", roomId, inviteeEmail);
    }

}
