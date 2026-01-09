package com.example.demo.domain.repository;

import com.example.demo.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/*
* User Entity 전용 Repository
*
* - DB 접근 책임
* - 비지니스 로직 X
*
* */

public interface UserRepository extends JpaRepository<User,Long> { //<Entity타입, PK타입>
    // 아무것도 작성하지 않아도 DB에 대한 기본 CRUD 메서드를 모두 사용 가능(by. JpaRepository)
    // 필요하다면 findByEmail(String email) 같은 메서드만 추가로 정의

    /*
    * 이메일 중복 여부 확인 : DB에 묻는 행위는 Repository가 비지니스 판단은 Service가 함
    *
    * SELECT COUNT(*) FROM users WHERE email =?
    * */
    boolean existsByEmail(String email);
}
