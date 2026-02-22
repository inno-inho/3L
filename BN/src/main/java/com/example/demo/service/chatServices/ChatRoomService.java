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
    public ChatRoomDto createRoom(String roomName, List<String> memberEmails, String requesterEmail) {
        String roomId = UUID.randomUUID().toString();

        LocalDateTime now = LocalDateTime.now();

        // 그룹 채팅이 아닐 경우(2명 이하), 전달받은 roomName이 이메일이라면
        // DB에는 Null로 저장하여 동적 생성을 유도
        String finalRoomName = roomName;
        if (memberEmails.size() <= 2 && (roomName == null || roomName.contains("@") || roomName.equals("1:1 채팅"))) {
            finalRoomName = null;
        }

        // 3명 이상일 때만 방장(Creator)을 설정
        String ownerEmail = (memberEmails.size() > 2) ? requesterEmail : null;

        ChatRoomEntity chatRoomEntity = ChatRoomEntity.builder()
                .roomId(roomId)
                .roomName(finalRoomName)
                .ownerEmail(ownerEmail)   // 방장 지정
                .chatRoomType(memberEmails.size() > 2 ? ChatMessageDto.ChatType.GROUP : ChatMessageDto.ChatType.FRIEND)
                .createdAt(now)
                .lastMessage("채팅방이 생성되었습니다.")
                .lastMessageTime(now)
                .build();
        chatRoomRepository.save(chatRoomEntity);

        // 멤버 추가
        for (String email : memberEmails) {
            if (email.equals(requesterEmail)) {
                // 방장은 메시지 없이 입장 처리
                chatRoomMemberService.joinRoomWithoutMessage(roomId, email);
            } else {
                // 그 외는 메시지랑 같이 처리
                chatRoomMemberService.joinRoom(roomId, email);
            }
        }

        // 인원 수 계산 후 번환 메서드
        int userCount = memberEmails.size();

        return chatCommonService.convertToRoomDto(chatRoomEntity, requesterEmail, userCount);
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

    // ########################################
    // 방 이름 수정
    // ########################################
    @Transactional
    public void updateRoomName (String roomId, String newName) {
        ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("방을 찾을 수 없습니다."));

        chatRoomEntity.setRoomName(newName);
        log.info("[ChatRoomService] 방 이름 변경: {} -> {}", roomId, newName);
    }

    // ########################################
    // 멤버 강퇴(혹은 스스로 나가기)
    // ########################################
    @Transactional
    public void kickMember(String roomId, String targetEmail, String requestUserEmail) {
        // 해당 멤버 찾기
        ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("참여 정보를 찾을 수 없습니다."));

        // 권한 확인: 요청저가 방장이거나, 혹은 본이이 스스로 나가는 경우에만 허용
        // 1:1 채팅은 ownerEmail이 없으므로 체크 예외 처리
        if (chatRoomEntity.getOwnerEmail() != null) {
            if (!chatRoomEntity.getOwnerEmail().equals(requestUserEmail) && !targetEmail.equals(requestUserEmail)) {
                throw new RuntimeException("강퇴 권한이 없거나 잘못된 요청입니다.");
            }
        }

        // 채팅방 멤버(참여 정보) 삭제
        ChatRoomMemberEntity chatRoomMemberEntity = chatRoomMemberRepository.findByRoomIdAndUserEmail(roomId, targetEmail)
                .orElseThrow(() -> new RuntimeException("참여 정보를 찾을 수 없습니다."));

        // 삭제(quit 메시지도 발행하기 위해서)
        chatRoomMemberService.leaveRoom(roomId, targetEmail);

        // 방에 알림 메시지 남기기
        chatRoomEntity.setLastMessage(targetEmail + "님이 퇴장하셨습니다.");
        chatRoomEntity.setLastMessageTime(LocalDateTime.now());

        log.info("[ChatRoomService] 멤버 퇴장/강퇴 완료: 방 ID = {}, 이메일 = {}", roomId, targetEmail);
    }

    // ########################################
    // 멤버 초대
    // ########################################
    @Transactional
    public void inviteMembers (String roomId, List<String> memberEmails, String requesterEmail) {
        ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("방을 찾을 수 없습니다."));

        for (String email : memberEmails) {
            // 이미 방에 있는지 확인 후 초대하는 로직 (ChatRoomMemberService에 구현)
            chatRoomMemberService.joinRoom(roomId, email);
        }

        // 1:1 방이었는데 인원이 추가되어 그룹방이 되는 경우
        int totalCount = chatRoomMemberRepository.countByRoomIdAndActiveTrue(roomId);
        if (totalCount > 2 && chatRoomEntity.getChatRoomType() == ChatMessageDto.ChatType.FRIEND) {
            chatRoomEntity.setChatRoomType(ChatMessageDto.ChatType.GROUP);
            // 만약 방장이 없다면 초대한 사람을 방장으로 지정
            if (chatRoomEntity.getOwnerEmail() == null) {
                chatRoomEntity.setOwnerEmail(requesterEmail);
            }
        }

        // 초대한 인원수만큼 알림 메시지 업데이트 가능
        chatRoomEntity.setLastMessage(memberEmails.size() + "명의 멤버가 초대되었습니다.");
        chatRoomEntity.setLastMessageTime(LocalDateTime.now());
    }

    // ######################################################
    // 방장이 스스로 나갈 때 방장 권한을 다른 사람에게 넘기는 로직
    // ######################################################
    @Transactional
    public void leaveRoom(String roomId, String userEmail) {
        ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("방을 찾을 수 없습니다."));


        // 방장 위임 로직
        if (ChatMessageDto.ChatType.GROUP.equals(chatRoomEntity.getChatRoomType())
                && userEmail.equals(chatRoomEntity.getOwnerEmail())){

            List<ChatRoomMemberEntity> otherMembers = chatRoomMemberRepository.findByRoomIdAndActiveTrue(roomId)
                    .stream()
                    .filter(m -> !m.getUserEmail().equals(userEmail))
                    .toList();

            if (!otherMembers.isEmpty()) {
                // 다른 사람이 있다면 위임
                String nextOwner = otherMembers.get(0).getUserEmail();
                chatRoomEntity.setOwnerEmail(nextOwner);
                log.info("[LeaveRoom] 방장 위임: {} -> {}", userEmail, nextOwner);
            } else {
                // 나밖에 없었다면 방 삭제 후 종료
                chatRoomRepository.delete(chatRoomEntity);
                log.info("[LeaveRoom] 마지막 멤버 퇴장으로 방 삭제: {}", roomId);
                return;
            }
        }

        // 실제 나가는 처리 (ChatRoomMemberService 호출)
        // 이 메서드 안에서 멤버 삭제(Hard/Soft Delete)와 "OO님이 퇴장하셨습니다" 메시지 발행을 다 해줍니다.
        chatRoomMemberService.leaveRoom(roomId, userEmail);

        // 방의 마지막 메시지 업데이트 (목록 보기에 출력용)
        chatRoomEntity.setLastMessage(userEmail + "님이 퇴장하셨습니다.");
        chatRoomEntity.setLastMessageTime(LocalDateTime.now());
    }

    // ##############################################
    // 방장 권한 위임
    // ##############################################
    @Transactional
    public void transferOwner(String roomId, String nextOwnerEmail, String requesterEmail) {
        ChatRoomEntity chatRoomEntity = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("방을 찾을 수 없습니다."));

        // 요청자가 현재 방장인지 확인
        if (!requesterEmail.equals(chatRoomEntity.getOwnerEmail())) {
            throw new RuntimeException("방장 권한을 넘길 권한이 없습니다.");
        }

        // 위임받을 유저가 현재 방에 존재하는지 확인
        boolean isMember = chatRoomMemberRepository.existsByRoomIdAndUserEmailAndActiveTrue(roomId, nextOwnerEmail);
        if (!isMember) {
            throw new RuntimeException("방에 참여 중인 멤버에게만 위임할 수 있습니다.");
        }

        // 방장 변경
        chatRoomEntity.setOwnerEmail(nextOwnerEmail);

        // 시스템 메시지 남기기
        String nextOwnerName = chatCommonService.resolveSenderName(nextOwnerEmail);
        chatRoomEntity.setLastMessage("방장이" + nextOwnerName + "님으로 변경되었습니다.");
        chatRoomEntity.setLastMessageTime(LocalDateTime.now());

        log.info("[chatRoomService_TransferOwner] 방장 위임 완료: {} -> {}", requesterEmail, nextOwnerEmail, roomId);

    }
}
