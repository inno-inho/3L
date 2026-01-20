package com.example.demo.controller;
/* controller = 통로*/
import com.example.demo.domain.dto.SignupRequest;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@RequestMapping("/auth")
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
    ){

        authService.signup(request); //실제 회원가입 로직은 Service에게 위임하겠다

        return ResponseEntity.ok().build(); //회원가입 처리는 끝났고 클라이언트에게 성공했다(200)라는 신호만 보내겠다!
    }
}
