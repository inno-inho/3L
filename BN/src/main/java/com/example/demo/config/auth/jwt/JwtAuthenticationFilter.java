package com.example.demo.config.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

/**
 * [ JwtAuthenticationFilter의 역할 ]
 * 모든 요청에서 JWT 토큰이 유효한지 확인하고,
 * 유효하다면 "이 사용자는 인증된 사용자입니다"라는 도장을 찍어주는 수문장 클래스
 */
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {

    // 토큰을 만들고 검증하는 기능을 가진 도구(Provider)를 가져옴
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // 1. 사용자가 보낸 요청 헤더에서 JWT 토큰을 꺼내옴 (예: Authorization: Bearer xxxxx)
        // resolveToken 메서드는 우리가 JwtTokenProvider에 만들어둔 '토큰 추출기'
        String token = jwtTokenProvider.resolveToken((HttpServletRequest) request);

        // 2. 토큰이 비어있지 않고, 유효한 토큰인지 검사 (만료되지 않았는지, 위조되지 않았는지)
        if (token != null && jwtTokenProvider.validateToken(token)) {

            // 3. 토큰이 완벽하다면, 토큰 안에 적힌 사용자 정보(이메일 등)를 꺼내서 '인증 객체'생성
            // 이 'Authentication' 객체는 "이 사람은 인증된 사람이다"라는 증명서와 동일(일시적임, 요청마다 새롭게 생성됨)
            Authentication authentication = jwtTokenProvider.getAuthentication(token);

            // 4. [매우 중요] 스프링 시큐리티의 '보관함(SecurityContextHolder)'에 이 증명서를 넣어둠
            // 이렇게 보관함에 넣어두면, 이 요청(ex>글쓰기)이 끝날 때까지 서버는 "이 사용자는 인증됨" 상태로 인식
                                    //프로필 편집과 같은 새로운 요청이 생길 때마다 SecurityContext가 새로 생김
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 5. 다음 단계로 (다른 필터가 있으면 다음 필터로, 없으면 실제 컨트롤러로)
        // 이 코드를 안 쓰면 요청이 여기서 중단되기에 꼭 써야함
        chain.doFilter(request, response);
    }
}