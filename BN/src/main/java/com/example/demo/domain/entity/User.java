package com.example.demo.domain.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * User Entity
 *
 * - DB의 users 테이블과 1:1 매핑
 * - 비즈니스 로직이 아닌 "상태"를 표현하는 객체
 * - 외부 요청(JSON)을 직접 받지 않음 (DTO 사용)
 */
@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email") // 이메일 중복 방지 (DB 차원)
        }
)
@Getter
//Entity 내부 상태를 “읽기 전용”으로 외부에 공개하기 위해 @Getter함수 사용
//@Setter은 무분별한 상태 변경을 막기 위해 사용하지 않음

@NoArgsConstructor(access = AccessLevel.PROTECTED)
// 기본 생성자 annotation == 아래에 @Builder 생성자가 이미 있기에 기본 생성자를 자동으로 만들어주지 않음
// 기본 생성자를 JPA가 필요로 하기에 이 어노테이션을 통해 생성필수
// access = PROTECTED (접근제한자)를 통해 JPA만 사용가능하도록 설정[for 정상적이지 않은 무분별한 객체 생성 방지]

public class User {

    /* =========================
       기본 키
       ========================= */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =========================
       인증 정보
       ========================= */

    /**
     * 로그인 ID로 사용
     * UNIQUE 제약 → 중복 회원 방지
     */
    @Column(nullable = false)
    private String email;

    /**
     * BCrypt로 암호화된 비밀번호만 저장
     * ❌ 절대 평문 저장 금지
     */

    /**
     * 회원가입 이후 Entity의 password 필드에는
     * Service에서 생성한 암호화된 비밀번호 값(encodedPassword)이 저장되어 있음
     */
    @Column(nullable = false)
    private String password;

    /* =========================
       사용자 정보
       ========================= */

    /**
     * 화면에 표시되는 이름
     */
    @Column(nullable = false)
    private String nickname;

    /**
     * 내부 식별용 이름 (실명 등)
     */
    @Column(nullable = false)
    private String username;

    private String phone;
    private String profileImageUrl;
    private String statusMessage;

    /* =========================
       상태 정보
       ========================= */

    /**
     * 마지막 로그인 시간
     */
    private LocalDateTime lastLoginAt;

    /**
     * 현재 접속 여부
     */
    @Column(nullable = false)
    private boolean isOnline;

    /**
     * 사용자 권한
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * 이메일 인증 완료 여부
     */
    @Column(nullable = false)
    private boolean isVerified;

    /* =========================
       시간 정보
       ========================= */
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // FE관련 추가 정보 컬럼
    private String birth;
    private String gender;
    private String agreement;

    /**
     * 회원가입 시 사용하는 생성자
     * → 기본값을 여기서 명확하게 설정
     */
    @Builder
    public User(
            String email,
            String password,
            String nickname,
            String username,
            String phone,
            Role role,
            boolean isVerified,
            String birth,
            String gender,
            String agreement
    ) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.username = username;
        this.phone = phone;
        this.role = role;
        this.isVerified = isVerified;
        this.birth = birth;
        this.gender = gender;
        this.agreement = agreement;
        this.isOnline = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}

