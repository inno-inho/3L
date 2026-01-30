package com.example.demo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 추가
public class NoticeRequestDto {

    // 공지글 생성/수정에 사용될 요청 클래스
    private String title;
    private String content;
    private String authorId;
    // 파일추가한 것도?

    // request는 entity를 절대 몰라야한다 => entity -> Dto는 responseDto에서만

}
