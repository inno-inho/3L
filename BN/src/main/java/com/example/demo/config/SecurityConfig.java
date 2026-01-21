package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/*
 * 보안 관련 공통 설정
 * */
@Configuration
@EnableWebSecurity
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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .formLogin(f -> f.disable())        // 폼 로그인 비활성화

                // 허용할 엔드포인트들
                .authorizeHttpRequests(auth ->
                        auth.anyRequest().permitAll()
                );

        // 세션 사용 안함
        http.sessionManagement((sessionManagerConfigure)->{
            sessionManagerConfigure.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        });




        return http.build();
    }

}