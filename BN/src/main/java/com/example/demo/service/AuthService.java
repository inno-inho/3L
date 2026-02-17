package com.example.demo.service;

// 인증 관련 비지니스 로직 담당
/** AuthService는
    Controller로부터 검증된 DTO를 받아
    비즈니스 규칙을 적용하고
    Entity를 생성하여 Repository를 통해 DB에 저장**/

import com.example.demo.config.auth.jwt.JwtTokenProvider;
import com.example.demo.domain.dto.LoginRequest;
import com.example.demo.domain.dto.LoginResponse;
import com.example.demo.domain.dto.SignupRequest;
import com.example.demo.domain.dto.UserResponseDto;
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

    private final JwtTokenProvider jwtTokenProvider; //토큰 생성기 주입

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
                .birth(request.getBirth())
                .gender(request.getGender())
                .agreement(request.getAgreement())
                .build();


        //4. DB 저장
        /*
        * - JpaRepository.save()
        * - 새로운 Entity -> INSERT
        * - @Transactional에 의해 여기까지 성공해야 커밋됨
        * */
        userRepository.save(user);
    }

    //-------------------------------------------------------
    /* 로그인 비즈니스 로직
       @param request 로그인 요청 DTO (email, password)
       @return 로그인 성공 응답 DTO (token, email, nickname)
    */
    public LoginResponse login(LoginRequest request) {

        // 1. 이메일 존재 여부 확인
        /* - 가입된 이메일이 있는지 UserRepository를 통해 확인
           - 존재하지 않는다면 "가입되지 않은 이메일"이라는 예외를 던져서 중단시킴
        */
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // 2. 비밀번호 일치 여부 검증
        /* - 중요한 점: DB에는 암호화된 비번이 있고, 사용자는 생(raw) 비번을 보낸 상태
           - passwordEncoder.matches(사용자가 입력한 비번, DB에 저장된 암호화 비번)
           - 이 함수가 내부적으로 복잡한 알고리즘을 써서 두 비번이 같은지 비교해줌
        */
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 통행증(JWT 토큰) 발급
        /* - 위 검증이 다 끝났다면 이 사람은 '진짜'
           - 이 사용자의 이메일을 담은 JWT 토큰(입장권)을 생성해서 보내줌
        */
        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole().name());
        /* user.getRole().name() 추가
        *  -> 로그인 메서드에서 createToken 호출 시 사용자 Role을 인자로 넘겨주어야 함 */

        // 4. 프론트엔드에 필요한 정보(LoginResponse) 조립해서 반환
        /* - 여기서 토큰(token)은 다음 API 호출을 위한 '통행증'이고,
           - 닉네임(nickname)은 프론트엔드 조원이 화면에 "코코넛님 환영합니다"를 띄우기 위해 쓰임
        */
        return LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .nickname(user.getNickname())
                .build();
    }


    // #######################################
    // 유저 정보 불러오기
    // #######################################
    @Transactional // 읽기 전용으로 성능 최적화
    public UserResponseDto getUserInfo(String email){

        // DB에서 해당 이메일을 가진 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        // 찾아온 User 엔티티를 UserResponseDto로 변환
        return UserResponseDto.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .username(user.getUsername())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .statusMessage(user.getStatusMessage())
                .role(user.getRole().name())
                .gender(user.getGender())
                .birth(user.getBirth())
                .build();
    }
}
