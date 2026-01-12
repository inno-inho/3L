package com.example.demo.service;

// 인증 관련 비지니스 로직 담당
/** AuthService는
    Controller로부터 검증된 DTO를 받아
    비즈니스 규칙을 적용하고
    Entity를 생성하여 Repository를 통해 DB에 저장**/

import com.example.demo.domain.dto.SignupRequest;
import com.example.demo.domain.entity.Role;
import com.example.demo.domain.entity.User;
import com.example.demo.domain.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
/*
* 이 클래스가 비즈니스 로직 담당 객체임을 Spring에게 알림
* 다른 클래스에서 주입(@Autowired / 생성자 주입) 가능 == 이 클래스는 Spring이 만들어서 다른 곳에 넣을 수 있는 객체
* @Component와 기능적으로 같지만 Service 역할임을 명확히 하기 위해 사용
* */
@RequiredArgsConstructor
/*
*  - final 필드 또는 @NonNull 필드만을 파라미터로 받는
*    생성자를 자동으로 만들어줌
*
* → public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder)
*    에 대한 생성자가 자동 생성됨
* */
@Transactional
/*
* 이 클래스(또는 메서드)에서 실행되는 DB 작업을 하나의 트랜잭션으로 묶음
* 의미 :
* - 중간에 예외 발생 시 -> 전체 롤백
* - 모든 DB 작업이 성공해야 커밋
*
* 여기서는 :
* - User 저장(save)이 실패하면 회원가입 전체가 실패 처리됨
* */
public class AuthService {

    /*
    * UserRepository
    *
    * -User Entity 전용 DB 접근 객체
    * -이메일 중복 검사, 사용자 저장 등의 DB 질문을 담당
    * */
    private final UserRepository userRepository;


    /* PasswordEncoder
    * - Spring Security가 제공하는 비밀번호 암호화 인터페이스
    * - 단방향 해시 (복호화 불가)
    * - BCrypt 등의 구현체가 Bean으로 등록되어 있음
    *
    * → Service는 암호화하라라는 책임만 갖고 어떤 알고리즘인지는 알 필요 X(역할 분리)*/
    private final PasswordEncoder passwordEncoder;

    //회원가입 비지니스 로직
    /*
    * @param request 회원가입 요청 DTO
    *
    * 흐름:
    * 1. 이메일 중복 여부 확인
    * 2. 비밀번호 암호화
    * 3. User Entity 생성
    * 4. DB 저장
    * */

    public void signup(SignupRequest request){//request : 이 메서드에 들어온 요청데이터

        //1.이메일 중복 검사
        /*
        *  - Repository에게 DB에 이 이메일이 있는지 질문
        *  - 비지니스 규칙 : 이미 존재하는 이메일이면 가입 불가
        * */

        //=> 회원가입 요청에서 전달된 이메일이 DB의 User 테이블에 존재하는지 확인해라
        if (userRepository.existsByEmail(request.getEmail())){
                                        /*request.getEmail() : 회원가입 요청으로 들어온 JSON에서 변환된
                                                               DTO에서 email 필드 값 꺼냄*/

            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            /*
            - 잘못된 요청 값에 대한 예외
            - 이후 @ControllerAdvice에서 400 Bad Request로 변환가능
            * */
        }

        //2. 비밀번호 암호화
        /*
        * - DTO에서는 평문 비밀번호
        * - DB에서는 절대 평문 저장 X
        *
        * passwordEncoder.encode()
        * -> 단방향 해시, 같은 비밀번호라도 매번 다른 값(salt)
        *
        * 전체 흐름:
        * Service가 평문 비밀번호를 암호화해서 암호화된 값(encodedPassword)을 만들고
          그 값을 이용해 Entity를 생성한 뒤 DB에 저장
          == 회원가입 이후 Entity의 password 필드에는 Service에서 생성한 암호화된 비밀번호 값(encodedPassword)이 저장되어 있음
        * */
        String encodedPassword = passwordEncoder.encode(request.getPassword());


        //3. User Entity 생성(User Entity는 클래스(설계도), Service에서 만드는 건 객체(인스턴스)
        /*
        * - DTO -> Entity 변환
        * - 이 시점에서만 Entity 생성
        * - role, isVerified 같은 값은 서버가 결정하는 값
        * */
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .username(request.getUsername())
                .phone(request.getPhone())
                .role(Role.USER)        //기본 권한은 USER
                .isVerified(true)       //이메일 인증 완료된 사용자만 가입
                .build();


        //4. DB 저장
        /*
        * - JpaRepository.save()
        * - 새로운 Entity -> INSERT
        * - @Transactional에 의해 여기까지 성공해야 커밋됨
        * */
        userRepository.save(user);
    }
}
