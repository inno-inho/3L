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
                .map(member -> {
                    // 방 정보 가져오기
                    ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(member.getRoomId())
                            .orElseThrow(() -> new RuntimeException("방을 찾을 수 없습니다."));


                    // 현재 방의 총 인원 수 계산
                    int userCount = chatRoomMemberRepository.countByRoomIdAndActiveTrue(chatRoomEntity.getRoomId());

                    System.out.println("조회된 방 개수: " + chatRoomMemberEntities.size());

                    // DTO로 변환
                    return chatCommonService.convertToRoomDto(chatRoomEntity, userEmail, userCount);
                })
                // 반환된 Dto 리스트를 lastMessageTime 기준으로 내림차순 정렬
                .sorted((r1, r2) -> {   // 리스트를 스트림으로 바꾼 다음 sorted로 r1, r2를 비기ㅛ
                    if (r1.getLastMessageTime() == null) return 1;      // null 은 항상 최하단, 마지막 메시지가 없는 채팅방은 뒤로 보냄
                    if (r2.getLastMessageTime() == null) return -1;     //
                    // 마지막 메시지 시간이 최신인 것이 위로 오도록 역순 설정
                    return r2.getLastMessageTime().compareTo(r1.getLastMessageTime());  // a.compareTo(b) -> a가 나중 -> 양수
                })                                                                      //                -> a가 이전 -> 음수
                .toList();

    }

}
