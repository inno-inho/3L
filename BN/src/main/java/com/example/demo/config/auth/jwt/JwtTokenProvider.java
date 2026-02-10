package com.example.demo.config.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;

/**
 * [ JwtTokenProvider의 역할 ]
 * 1. JWT 토큰을 생성 (로그인 시)
 * 2. 토큰이 진짜인지 위조되었는지 검증 (API 호출 시)
 * 3. 토큰에서 사용자 정보(이메일)를 꺼냄
 */
@Component // 스프링이 이 객체를 만들어서 관리하도록 빈(Bean)으로 등록
public class JwtTokenProvider {

    // 1. [비밀번호] 우리 서버만의 비밀 열쇠 (이게 털리면 해커가 토큰을 마음대로 찍어냄)
    // [수정] properties에서 키를 읽어옴
    @Value("${jwt.secret}")
    private String secretKey;
    
    private Key key; // 실제로 암호화에 사용할 Key 객체

    // 2. [유효기간] 이 토큰이 언제까지 쓸 수 있는지 정함 (현재 1시간)
    private final long tokenValidityInMilliseconds = 3600000L;

    /**
     * @PostConstruct: 스프링이 이 클래스를 생성한 후, 자동으로 딱 한 번 실행되는 메서드
     * 우리가 적은 secretKey 문자열을 컴퓨터가 쓰기 좋게 인코딩하고 세팅하는 과정
     */
    @PostConstruct
    protected void init() {
        // [수정] 작성한 문자열을 UTF-8 바이트로 변환하여 HMAC-SHA 키로 생성
        // 이 과정에서 키 길이가 짧으면 에러가 나지만 현재 키는 충분히 길어서 안전함
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);

    }

    /**
     * 3. [토큰 생성] 로그인 성공 시 호출됨
     * @param email 유저를 식별할 수 있는 값 (이메일)
     * @return 암호화된 JWT 토큰 문자열
     */
    public String createToken(String email) {
        // Claims: 토큰의 '내용물' (누구꺼냐, 언제 만들었냐 등)
        Claims claims = Jwts.claims().setSubject(email); // 유저 식별값(Subject)으로 이메일 저장
        Date now = new Date();
        Date validity = new Date(now.getTime() + tokenValidityInMilliseconds); // 지금부터 1시간 뒤가 만료일

        return Jwts.builder()
                .setClaims(claims)      // 내용물 넣기
                .setIssuedAt(now)      // 만든 시간
                .setExpiration(validity) // 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // ★중요: 서버 비밀도장(key)으로 서명하기
                .compact(); // 문자열로 변환해서 완성
    }

    /**
     * 4. [인증 도장 찍기] 토큰이 유효하면 '로그인 성공 상태'로 만들어주는 객체 생성
     */
    public Authentication getAuthentication(String token) {
        // 토큰을 열어서 그 안에 들어있는 유저 이메일을 꺼냄
        String email = Jwts.parserBuilder()
                .setSigningKey(key).build() // 내 비밀도장(key)을 대조해보고
                .parseClaimsJws(token)      // 토큰 껍데기를 까서
                .getBody().getSubject();    // 안에 적힌 이메일 추출

        // 스프링 시큐리티에게 "이 유저 인증됐어!"라고 알려주는 전용 객체 반환
        // (두 번째 인자는 비밀번호인데, 이미 토큰으로 인증됐으니 빈칸으로 둠)
        return new UsernamePasswordAuthenticationToken(email, "", new ArrayList<>());
    }

    /**
     * 5. [토큰 꺼내기] 프론트엔드가 보낸 택배(HTTP 요청)에서 '토큰'만 쏙 뽑아냄
     */
    public String resolveToken(HttpServletRequest req) {
        // 프론트엔드는 관례적으로 "Authorization: Bearer [토큰값]" 이렇게 보냄
        String bearerToken = req.getHeader("Authorization");

        // "Bearer " 뒤에 있는 실제 토큰 문자열만 잘라내기
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 가 7자이므로 그 이후부터 가져옴
        }
        return null;
    }

    /**
     * 6. [위조 검사] 토큰이 가짜인지, 시간이 지났는지 확인
     */
    public boolean validateToken(String token) {
        try {
            // 서버가 가진 비밀도장(key)으로 토큰을 풀어봄
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);

            // 만료 날짜가 지금보다 이전(before)이 아니라면 true (즉, 아직 유효함)
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            // 만약 토큰이 위조되었거나, 만료되었다면 에러가 발생해서 여기로 옴
            return false;
        }
    }
}