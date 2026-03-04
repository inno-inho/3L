package com.example.demo.service;

import com.example.demo.domain.Repository.FriendRepository;
import com.example.demo.domain.dto.UserResponseDto;
import com.example.demo.domain.entity.FriendEntity;
import com.example.demo.domain.entity.FriendStatus;
import com.example.demo.domain.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRepository friendRepository;
    private final com.example.demo.domain.repository.UserRepository userRepository;

    // entity에서 user정보 갖고오기
    private UserResponseDto convertToDto (User user) {
        return UserResponseDto.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfileImageUrl())
                .statusMessage(user.getStatusMessage())
                .username(user.getUsername())
                .build();
    }

    // #########################################
    // 유저 검색 (친구 신청을 위해)
    // #########################################
    @Transactional(readOnly = true)
    public List<UserResponseDto> searchUsers(String keyword, String currentUserEmail) {

        // 닉네임이나 이메일에 키워드가 포함된 유저 검색 (나 제외)
        return  userRepository.findByNicknameContainingOrEmailContaining(keyword, keyword).stream()
                .filter(user -> !user.getEmail().equals(currentUserEmail))
                .map(this::convertToDto)
                .toList();
    }

    // 친구 신청 (PENDING)
    @Transactional
    public void requestFriend(String requesterEmail, String targetEmail) {
        // 이미 관계가 있는지 확인(중복 신청 방지)
        Optional<FriendEntity> relation = friendRepository.findRelation(requesterEmail, targetEmail);

        if (relation.isEmpty()) {
            FriendEntity newRequest = FriendEntity.builder()
                    .requesterEmail(requesterEmail)
                    .friendEmail(targetEmail)
                    .friendStatus(FriendStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();
            friendRepository.save(newRequest);
        } else {
            // 이미 관계가 있는 경우
            throw new IllegalStateException("이미 존재하는 관계입니다.");
        }
    }

    // #################################
    // 나에게 온 친구 신청 목록들 보는 기능
    // #################################
    @Transactional(readOnly = true)
    public List<UserResponseDto> getPendingRequests(String myEmail) {
        // friendRepository에서 friendEmail이 '나'이고 상태가 PENDING인 데이터 조회
        return friendRepository.findByFriendEmailAndFriendStatus(myEmail, FriendStatus.PENDING)
                .stream()
                .map(relation -> {
                    // 신청자의 정보를 가져오기 위해 userRepository 조회
                    User requester = userRepository.findByEmail(relation.getRequesterEmail())
                            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

                    return convertToDto(requester);
                })
                .toList();
    }

    // #################################
    // 친구 수락 (ACCEPTED)
    // #################################
    @Transactional
    public void acceptFriend (String myEmail, String requesterEmail) {
        // 나에게 온 친구 신청을 찾음
        FriendEntity relation = friendRepository.findByRequesterEmailAndFriendEmail(requesterEmail, myEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신청입니다."));

        if (relation.getFriendStatus() == FriendStatus.PENDING) {
            relation.setFriendStatus(FriendStatus.ACCEPTED);
            relation.setAcceptedAt(LocalDateTime.now());
        }
    }

    // ########################################
    // 친구 목록 조회(친구 요청 수락한 진짜 친구)
    // ########################################
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAcceptedFriends(String myEmail) {
        // ACCEPTED 상태인 모든 관계 조회
        List<FriendEntity> relations = friendRepository.findAllAcceptedFriends(myEmail);

        return relations.stream()
                .map(relation -> {
                    // 관계 중 내가 아닌 상대방의 이메일 찾기
                    String friendEmail = relation.getRequesterEmail().equals(myEmail)
                            ? relation.getFriendEmail()
                            : relation.getRequesterEmail();

                    // 상대방의 유저 정보 조회
                    User friend = userRepository.findByEmail(friendEmail)
                            .orElseThrow(() -> new IllegalArgumentException("친구의 정보를 찾을 수 없습닏나."));
                    return convertToDto(friend);
                })
                .toList();
    }

    // #########################################
    // 차단 기능
    // #########################################
    @Transactional
    public void blockUser(String requesterEmail, String targetEmail) {
        // 기존 관계가 있는지 확인 (이미 친구이거나, 친구 신청중이거나, 이미 차단했거나)
        Optional<FriendEntity> existingRelation = friendRepository.findRelation(requesterEmail, targetEmail);

        if (existingRelation.isPresent()) {
            // 기존 관계가 있다면 상태를 BLOCKED로 강제 변경
            FriendEntity relation = existingRelation.get();
            relation.setFriendStatus(FriendStatus.BLOCKED);
            relation.setBlockedBy(requesterEmail);
            log.info("[FriendService_blockUser] 기존 관계 업데이트: {}가 {}를 차단함", requesterEmail, targetEmail);
        } else {
            // 관계가 전혀 없던 유저라면 새로 생성
            FriendEntity newBlock = FriendEntity.builder()
                    .requesterEmail(requesterEmail)
                    .friendEmail(targetEmail)
                    .friendStatus(FriendStatus.BLOCKED)
                    .blockedBy(requesterEmail)
                    .createdAt(LocalDateTime.now())
                    .build();
            friendRepository.save(newBlock);
            log.info("[FriendService_blockUser] 신규 차단 생성: {}가 {}를 차단함", requesterEmail, targetEmail);
        }
    }

    // ##################################
    // 차단 목록 조회 로직
    // ##################################
    @Transactional(readOnly = true)
    public List<UserResponseDto> getBlockedList(String myEmail) {
        return friendRepository.findByBlockedByAndFriendStatus(myEmail, FriendStatus.BLOCKED)
                .stream()
                .map(relation -> {
                    User target = userRepository.findByEmail(relation.getFriendEmail())
                            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

                    return convertToDto(target);
                })
                .toList();
    }

    // 차단 해제 로직
    @Transactional
    public void unblockUser(String myEmail, String targetEmail) {
        FriendEntity friendEntity = friendRepository.findByRequesterEmailAndFriendEmail(myEmail, targetEmail)
                .filter(f -> f.getFriendStatus() == FriendStatus.BLOCKED)
                .orElseThrow(() -> new IllegalArgumentException("차단 관계가 아닙니다."));

        friendRepository.delete(friendEntity);
    }


    // ###################################
    // 친구 삭제 (이미 수락된 관계를 끊음)
    // ###################################
    @Transactional
    public void deleteFriend(String myEmail, String friendEmail) {
        // 어느 쪽이 친구 삭제를 신청했든 두 사람 사이의 "ACCEPTED" 관계를 찾음
        FriendEntity relation = friendRepository.findRelation(myEmail, friendEmail)
                .filter(f -> f.getFriendStatus() == FriendStatus.ACCEPTED)
                .orElseThrow(() -> new IllegalArgumentException("친구 관계가 아닙니다."));

        friendRepository.delete(relation);
        log.info("[FriendService] 친구 삭제 완료: {}와 {}", myEmail, friendEmail);
    }

    // ####################################
    // 친구 신청 거절 (PENDING 상태의 신청을 거절)
    // ####################################
    @Transactional
    public void rejectFriendRequest(String myEmail, String requesterEmail) {
        // 나에게 온 신청(PENDING)을 찾아서 삭제
        FriendEntity relation = friendRepository.findByRequesterEmailAndFriendEmail(requesterEmail, myEmail)
                .filter(f -> f.getFriendStatus() == FriendStatus.PENDING)
                .orElseThrow(() -> new IllegalArgumentException("거절할 신청이 존재하지 않습니다."));

        friendRepository.delete(relation);
        log.info("[FriendService] 친구 신청 거절 완료: {} -> {}", requesterEmail, myEmail);
    }
}
