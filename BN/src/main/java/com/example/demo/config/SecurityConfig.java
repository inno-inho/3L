package com.example.demo.config;

import com.example.demo.config.auth.jwt.JwtAuthenticationFilter;
import com.example.demo.config.auth.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/*
* 보안 관련 공통 설정
* */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // 토큰 검증 도구
    private final JwtTokenProvider jwtTokenProvider;

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
                .csrf(csrf -> csrf.disable()) // REST API이므로 CSRF 비활성화
                .formLogin(f -> f.disable())   // 기본 로그인 폼 비활성화
                .httpBasic(h -> h.disable())   // HTTP Basic 인증 비활성화

                // 1. 세션 정책 설정: 세션을 만들지도 사용하지도 않음 (JWT 방식의 핵심)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 2. 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // 로그인, 회원가입은 인증 없이 접근 가능
                        .anyRequest().authenticated()           // 그 외 모든 요청은 토큰이 있어야 함
                )

                // 3. 필터 추가: ID/PW 검사 필터(UsernamePasswordAuthenticationFilter) 전에
                // 우리가 만든 JWT 필터를 먼저 실행해서 토큰이 있는지 확인하겠다는 뜻
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
