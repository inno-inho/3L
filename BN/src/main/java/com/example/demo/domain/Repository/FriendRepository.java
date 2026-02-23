package com.example.demo.domain.Repository;

import com.example.demo.domain.entity.FriendEntity;
import com.example.demo.domain.entity.FriendStatus;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<FriendEntity, Long> {

    Optional<FriendEntity> findByRequesterEmailAndFriendEmail(String requesterEmail, String friendEmail);
    // 이미 관계가 존재하는지 확인(친구, 신청 중, 차단 중)
    @Query("SELECT f FROM FriendEntity f WHERE " +
            "(f.requesterEmail = :email1 AND f.friendEmail = :email2) OR " +
            "(f.requesterEmail = :email2 AND f.friendEmail = :email1)")
    Optional<FriendEntity> findRelation(@Param("email1") String email1, @Param("email2") String email2);

    // 수락된 친구 목록 조회 (내가 보냈거나, 내가 받았거나 둘 다 포함)
    @Query("SELECT f FROM FriendEntity f WHERE " +
            "(f.requesterEmail = :email OR f.friendEmail = :email) " +
            "AND f.friendStatus = 'ACCEPTED'")
    List<FriendEntity> findAllAcceptedFriends(@Param("email") String email);

    // 나에게 온 친구 신청 목록 (수락 대기 중인 것)
    List<FriendEntity> findByFriendEmailAndFriendStatus(String friendEmail, FriendStatus friendStatus);

    // 내가 누군가를 차단했는지 여부 확인(메시지 수신 거부용)
    boolean existsByBlockedByAndFriendEmail(String blockedBy, String targetEmail);

    // 내가 차단당했는지 확인 (상대방이 나를 차단했는지)
    @Query("SELECT EXISTS (SELECT 1 FROM FriendEntity f WHERE " +
            "f.blockedBy = :targetEmail AND " +
            "(f.requesterEmail = :myEmail OR f.friendEmail = :myEmail) " +
            "AND f.friendStatus = 'BLOCKED')")
    boolean isAmIBlocked(@Param("myEmail") String myEmail, @Param("targetEmail") String targetEmail);
}
