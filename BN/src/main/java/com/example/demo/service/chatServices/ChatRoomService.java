package com.example.demo.service.chatServices;

import com.example.demo.domain.Repository.chatRepository.ChatRoomMemberRepository;
import com.example.demo.domain.Repository.chatRepository.ChatRoomRepository;
import com.example.demo.domain.dto.chatDto.ChatMessageDto;
import com.example.demo.domain.dto.chatDto.ChatRoomDto;
import com.example.demo.domain.entity.chatEntities.ChatRoomEntity;
import com.example.demo.domain.entity.chatEntities.ChatRoomMemberEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
    public ChatRoomDto createRoom(String roomName, List<String> memberEmails) {
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

        return chatCommonService.convertToRoomDto(chatRoomEntity, userCount);
    }

    // #############################################
    // 내가 참여중인 채팅방 정보 가져오기
    // #############################################
    @Transactional
    public List<ChatRoomDto> findAllRooms(String userEmail) {
        // 내가 참여 중인 방 목록 조회
        List<ChatRoomMemberEntity> chatRoomMemberEntities = chatRoomMemberRepository.findByUserEmailAndActiveTrue(userEmail);

        return chatRoomMemberEntities.stream()
                .map(member -> {
                    // 방 정보 가져오기
                    ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(member.getRoomId())
                            .orElseThrow(() -> new RuntimeException("방을 찾을 수 없습니다."));


                    // 현재 방의 총 인원 수 계산
                    int userCount = chatRoomMemberRepository.countByRoomIdAndActiveTrue(chatRoomEntity.getRoomId());

                    System.out.println("조회된 방 개수: " + chatRoomMemberEntities.size());

                    // DTO로 변환
                    return chatCommonService.convertToRoomDto(chatRoomEntity, userCount);
                })
                .toList();

    }

}
