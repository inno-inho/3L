package com.example.demo.service.chatServices;

import com.example.demo.domain.Repository.chatRepository.ChatRoomMemberRepository;
import com.example.demo.domain.Repository.chatRepository.ChatRoomRepository;
import com.example.demo.domain.dto.chatDto.ChatMessageDto;
import com.example.demo.domain.dto.chatDto.ChatRoomDto;
import com.example.demo.domain.entity.chatEntities.ChatRoomEntity;
import com.example.demo.domain.entity.chatEntities.ChatRoomMemberEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


// 채팅방 생성, 내가 참여중인 채팅방 목록 불러오기, 나가기 등등
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatRoomMemberService chatRoomMemberService;
    private final ChatCommonService chatCommonService;


    // #########################################
    // 채팅방 생성
    // #########################################
    @Transactional
    public ChatRoomDto createRoom(String roomName, List<String> memberEmails, String creatorEmail) {
        String roomId = UUID.randomUUID().toString();

        LocalDateTime now = LocalDateTime.now();

        ChatRoomEntity chatRoomEntity = ChatRoomEntity.builder()
                .roomId(roomId)
                .roomName(roomName)
                .chatRoomType(memberEmails.size() > 2 ? ChatMessageDto.ChatType.GROUP : ChatMessageDto.ChatType.FRIEND)
                .createdAt(now)
                .lastMessage("채팅방이 생성되었습니다.")
                .lastMessageTime(now)
                .build();
        chatRoomRepository.save(chatRoomEntity);

        // 멤버 추가
        for (String email : memberEmails) {
            chatRoomMemberService.inviteUser(roomId, email);
        }

        // 입장 일림 메시지 생성


        // 인원 수 계산 후 번환 메서드
        int userCount = memberEmails.size();

        return chatCommonService.convertToRoomDto(chatRoomEntity, creatorEmail, userCount);
    }

    // #############################################
    // 내가 참여중인 채팅방 정보 가져오기
    // #############################################
    @Transactional
    public List<ChatRoomDto> findAllRooms(String userEmail) {
        // 내가 참여 중인 방 목록 조회
        List<ChatRoomMemberEntity> chatRoomMemberEntities = chatRoomMemberRepository.findByUserEmailAndActiveTrue(userEmail);

        return chatRoomMemberEntities.stream()
                // 방 정보 가져오기
                .map(member -> chatRoomRepository.findById(member.getRoomId())
                        .orElseThrow(() -> new RuntimeException("방을 찾을 수 없습니다.")))

                // 3. LocalDateTime(Entity) 기준으로 정렬
                .sorted((e1, e2) -> {
                    if (e1.getLastMessageTime() == null) return 1;
                    if (e2.getLastMessageTime() == null) return -1;
                    return e2.getLastMessageTime().compareTo(e1.getLastMessageTime());
                })

                // 정렬된 순서대로 인원수 계산 및 DTO 변환
                .map(entity -> {
                    // 채팅방의 인원수 계산 로직
                    int userCount = chatRoomMemberRepository.countByRoomIdAndActiveTrue(entity.getRoomId());

                    log.info("방 이름: {}, 마지막 시간: {}", entity.getRoomName(), entity.getLastMessageTime());

                    return chatCommonService.convertToRoomDto(entity, userEmail, userCount);
                })
                .toList();
    }
}
