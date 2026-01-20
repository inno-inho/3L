package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/*
* 보안 관련 공통 설정
* */
@Configuration
public class SecurityConfig {

    /*
    * 비밀번호 암호화 Bean
    * : 객체 생성 권한을 Spring에게 위임하여 해당 객체를 싱글톤으로 관리하고
    * 다른 클래스에서 의존성 주입이 가능하도록 함
    * */
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
