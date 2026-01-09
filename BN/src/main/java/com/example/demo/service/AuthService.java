package com.example.demo.service;

// 인증 관련 비지니스 로직 담당

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
/*
* 이 클래스가 비즈니스 로직 담당 객체임을 Spring에게 알림
* 다른 클래스에서 주입(@Autowired / 생성자 주입) 가능 == 이 클래스는 Spring이 만들어서 다른 곳에 넣을 수 있는 객체
* @Component와 기능적으로 같지만 Service 역할임을 명확히 하기 위해 사용
* */
@RequiredArgsConstructor
@Transactional
public class AuthService {
}
