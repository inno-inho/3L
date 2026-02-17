package com.example.demo.config;

import com.example.demo.config.auth.jwt.JwtAuthenticationFilter;
import com.example.demo.config.auth.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .cors(Customizer.withDefaults()) // WebConfig에서 설정한 CORS를 Security에 적용
                .csrf(csrf -> csrf.disable()) // REST API이므로 CSRF 비활성화
                .formLogin(f -> f.disable())   // 기본 로그인 폼 비활성화
                .httpBasic(h -> h.disable())   // HTTP Basic 인증 비활성화

                // 1. 세션 정책 설정: 세션을 만들지도 사용하지도 않음 (JWT 방식의 핵심, JWT 사용 시 필수)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 2. 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/api/auth/user").authenticated()
                                .requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()
//                                .requestMatchers("/api/auth/**").permitAll() // 혹시 모를 다른 auth 경로 허용
                                .requestMatchers("/ws/**").permitAll()
                                .requestMatchers("/uploads/**").permitAll()

                                // [공지사항] 권한 설정
                                // 조회(Read)는 인증된 모든 사용자 가능
                                .requestMatchers(HttpMethod.GET, "/api/notices/**").authenticated()
                                // 등록/수정/삭제(CUD)는 관리자(ADMIN)만 가능
                                .requestMatchers(HttpMethod.POST, "/api/notices/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/notices/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/notices/**").hasRole("ADMIN")

                                // [채팅방] 권한 설정
                                // 조회 및 CRUD 전체를 인증된 모든 사용자에게 허용
                                .requestMatchers("/api/chatrooms/**").authenticated()

                                // 나머지 모든 요청은 인증 필요
                                .anyRequest().authenticated()
                        // .anyRequest().permitAll()
                )

                // 3. 필터 추가: ID/PW 검사 필터(UsernamePasswordAuthenticationFilter) 전에
                // 우리가 만든 JWT 필터를 먼저 실행해서 토큰이 있는지 확인하겠다는 뜻
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}