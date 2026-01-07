### docker 명령어

```
# docker 실행 명령어
docker-compose -f docker-compose.local.yml --env-file .env.local up -d --build

docker-compose -f docker-compose.local.yml --env-file .env.local up
docker-compose -f docker-compose.local.yml --env-file .env.local down

# bn -> demoapplication run
```

### notice 관련
```
POST   api/notices                     // 공지 등록 (관리자)
GET    api/notices                     // 공지 목록 조회
GET    api/notices/{id}                // 공지 상세 조회
PUT    api/notices/{id}                // 공지 수정 (관리자)
DELETE api/notices/{id}                // 공지 삭제 (관리자)

PUT    api/notices/{id}/pin             // 상단 고정/해제
PUT    api/notices/{id}/important       // 중요 공지 설정

POST   api/notices/{id}/schedule        // 예약 공지 설정

GET    api/notices/search               // 제목/내용 검색
GET    api/notices/filter               // 기간/중요 공지 필터

POST   api/notices/{id}/files           // 파일 첨부
GET    api/notices/{id}/files/{fileId}  // 파일 다운로드

POST   api/notices/{id}/comments
```

### 공지사항 (관리자)
공지사항 CRUD (목록 / 상세 조회 포함)
파일 첨부 및 다운로드
메타 정보 관리
제목
내용 (텍스트 / 에디터)
작성자 (관리자)
작성일 / 수정일
조회수
권한 관리
관리자: 생성 / 수정 / 삭제
일반 사용자: 조회만 가능
목록 UX
최신순 정렬
페이지네이션
추가 기능
고정 공지 기능
상단 고정
고정 / 해제 토글
예약 공지
특정 날짜 / 시간에 자동 공개
이벤트 / 점검 공지 활용
검색 & 필터
제목 / 내용 검색
기간별 필터
중요 공지만 보기
중요 공지 알림
중요 공지 등록 시 자동 푸시 알림

### NOTICE DB 저장목록
id (PK)  
title  
content  
author_id  
view_count  
is_pinned -- 상단 고정 여부  
is_important -- 중요 공지 여부  
open_at -- 예약 공개 시간  
created_at  
updated_at  

NOTICE_COMMENT  
id (PK)  
notice_id (FK)  
user_id (FK)  
parent_id (nullable)  
content  
created_at  




[메신저 구현](https://qkrqkrrlrl.tistory.com/193)  
[캘린더](https://www.youtube.com/watch?v=fIUxbj1f7SE)  
[캘린더](https://junesker.tistory.com/125?category=1238556)  
[기획설계](https://www.youtube.com/watch?v=NTZgPYlassE&list=PLbq5jHjpmq7q-Td2jOXtpf7SD5c53RqXh&index=1)  
[기획설계-문서화](https://www.youtube.com/redirect?event=comments&redir_token=QUFFLUhqbXVjNkZoQVVybExZUDg4VkhKZ3hUOTNYYW5kQXxBQ3Jtc0tuVFlyX1FPZGVzaTFoTmwwLTJxYzc3ZnBmQ2Z6Nk5wS0JUWHd2NzJjbExUOUNOa1k0TDA5RmhlY2VfOFlKalNzWkdETWtKNS1MQkJJYmJ3cG5sNXRBclA3eXdPX3RKM0NaN0J3cEdWZGZ5bEtCOG5PTQ&q=https%3A%2F%2Fprickle-textbook-12d.notion.site%2FHoons-Board-REST-API-89f600999f6548ff998d8ec8211062a7%3Fpvs%3D4)  
[TypeScript](https://youtu.be/vs9lFblZ7oE?si=0tqi5_Nz9jKBWM6G)  
