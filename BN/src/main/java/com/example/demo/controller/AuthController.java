package com.example.demo.controller;
/* controller = 통로*/
import com.example.demo.domain.dto.LoginRequest;
import com.example.demo.domain.dto.LoginResponse;
import com.example.demo.domain.dto.SignupRequest;
import com.example.demo.domain.dto.UserResponseDto;
import com.example.demo.service.AuthService;
import com.nimbusds.openid.connect.sdk.UserInfoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/*
* 인증 관련 API 엔드포인트
* -> 이 클래스는 요청을 받는 입구Controller 역할
* -> 회원가입, 로그인 같은 HTTP 요청 처리
* */
@RestController
/* 이 클래스가 REST API용 Controller임을 Spring에게 알림
@Controller + @ResponseBody가 합쳐진 상태
메서드의 반환값을 View가 아닌 "JSON / HTTP 응답 바디"로 바로 반환
* */
@RequestMapping("/api/auth")
/*
* - 이 Controller의 모든 API는 "/auth"로 시작
* - 아래 @PostMapping("/signup")과 합쳐져서 최종경로는 "/auth/signup"이 됨
* */
@RequiredArgsConstructor
/*
* - final 필드만을 파라미터로 받는 생성자를 자동 생성
* - 여기서는 AuthService를 주입받기 위한 생성자를 만들어줌
* - 생성자 주입 방식 -> 가장 권장되는 DI 방식
* */
public class AuthController {

    private final AuthService authService;
    /*
     * - 실제 로직은 Service에 위임하고 Controller는 요청/응답만 처리(역할 분리)
     * */


    /*
     * 회원가입 API
     * HTTP POST /auth/signup
     * */
    @PostMapping("/signup")
    /*
     * - HTTP POST 요청만 처리
     * - 회원가입처럼 데이터를 생성하는 경우 POST 사용
     * */
    public ResponseEntity<Void> signup(
            @RequestBody @Valid SignupRequest request
            /*
             * @RequestBody
             *
             * - HTTP 요청 바디(JSON)를 SignupRequestDto로 변환
             * - Jackson이 JSON → Java 객체로 매핑
             *
             * @Valid
             *
             * - SignupRequestDto에 선언된 Validation(@NotBlank, @Email 등)을 실행
             * - 검증 실패 시 Controller 메서드는 실행되지 않고
             *   MethodArgumentNotValidException 발생
             */
    ) {

        authService.signup(request); //실제 회원가입 로직은 Service에게 위임하겠다

        return ResponseEntity.ok().build(); //회원가입 처리는 끝났고 클라이언트에게 성공했다(200)라는 신호만 보내겠다!
    }

    /*
     * 로그인 API
     * HTTP POST /auth/login
     * */
    @PostMapping("/login")
    /*
     * - 사용자가 입력한 ID/PW를 JSON으로 받음
     * - 결과로 토큰과 사용자 정보를 포함한 LoginResponse를 반환
     * */
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {
        // 1. 서비스에게 로그인 업무 위임
        /* - AuthService의 login 메서드를 호출하여 검증 및 토큰 생성 진행
           - 성공 시 결과 데이터(LoginResponse)를 받아옴
           - => 서비스 로직 실행 후 결과값 반환
        */
        LoginResponse response = authService.login(request);

        // 2. 성공 응답 반환
        /* - HTTP 200 OK 상태 코드와 함께 생성된 토큰 정보를 JSON으로 클라이언트에게 전달
         */
        return ResponseEntity.ok(response);
    }

    // ############################################
    // 회원 정보 가져오기
    // ############################################
    @GetMapping("/user")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        // 토큰 인증 정보에서 이메일 추출
        String email = authentication.getName();

        // 서비스 호출해서 데이터 가져오기
        UserResponseDto userResponseDto = authService.getUserInfo(email);

        // 응답 반환
        return ResponseEntity.ok(userResponseDto);
    }


}
