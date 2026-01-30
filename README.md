## 병합시 주의 사항
- PR 올리기전에 항상 dev pull 해서 충돌은 올리는 사람이 해결  
- 첫 PR은 dev가 안바뀌어서 그냥 올리면 됩니다!(feature/chat 해당)  
- feature/notice, feature/auth는 각자 dev pull 해서 충돌 해결 후 올리기!  

```
1) 각자 feature 브랜치로 작업
2) 첫번째 주자(첫 병합) : dev 초기 상태로 dev pull 해도 변화 없는 상태
3) 두번째 주자 : dev에서 merge된 상태로 dev 브랜치의 최신 코드를 먼저 pull 혹은 merge 받아
  그 후 로컬 환경에서 충돌 난 부분을 수정하고 테스트를 마친 뒤, 다시 commit하여 PR을 업데이트
4) 세번째 주자도 3)과 마찬가지로 기능 두개가 합쳐진 상태의 dev를 받아 merge하고 충돌난 부분 해결 후 commit → PR
```

## BN 주의 사항
```
application-local.properties에서
notice 파일 첨부 경로 - C:/upload/notices
base-path : upload로 사용

```

## FN 주의 사항

### 공통 유틸 함수(FN)
```
src/utils/date.ts : 날짜 포맷 2026.01.01 형태

```

### SocialLoginButton 사용
```
```


### 페이지 너비, 높이 고정 XX
```
메인 레이아웃에서 width, height 조절
각자 페이지에서 width, height 건드리지 말 것
```

### '@' 사용 설정 & 폰트 설정
```
“@ = src” 라는 약속을 따로 설정해줘야 함 vite.config.ts 설정 필요
tailwind.config.js 설정 + index.html에 google font link 추가 + Header.tsx 37줄 : className에 font-nerko 추가
↓
build 다시 해줘야함(삭제 안해도 ok, 빌드만 해서 compose up 하면 적용 됨)
```



### Outlet 기반 방식  
React Router + Outlet 레이아웃 패턴  
- MainLayout 에 Header, SideBar 지정해둔 상태로 common 폴더 그대로 사용
- App.tsx  
  ```
  <Route element={<MainLayout />}>
    <Route path="/notices" element={<NoticeList />} />
    <Route path="/chatPage" element={<ChatPage />} />
  </Route>
  ```

### CSS 설정
```
부트스트랩 사용으로 기존 tailwind css가 밀리는 일 발생하면 → index.css에서 수정하고 main.tsx에서 import index.css를 젤 마지막에 해주기
```

---

## docker 명령어

```
# docker 실행 명령어
docker-compose -f docker-compose.local.yml --env-file .env.local up -d --build

docker-compose -f docker-compose.local.yml --env-file .env.local up
docker-compose -f docker-compose.local.yml --env-file .env.local down

# bn -> demoapplication run
```




## notice 관련
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

GET  api/notices/{noticeId}/files        // 첨부파일 조회
GET  api/notices/files/{fileId}/download // 첨부파일 다운로드

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


## Vite 프로젝트 구조
```
project-root/
├─ index.html        
├─ src/
│  ├─ main.tsx
│  └─ App.tsx
├─ public/
│  └─ vite.svg

```


[메신저 구현](https://qkrqkrrlrl.tistory.com/193)  
[캘린더](https://www.youtube.com/watch?v=fIUxbj1f7SE)  
[캘린더](https://junesker.tistory.com/125?category=1238556)  
[기획설계](https://www.youtube.com/watch?v=NTZgPYlassE&list=PLbq5jHjpmq7q-Td2jOXtpf7SD5c53RqXh&index=1)  
[기획설계-문서화](https://www.youtube.com/redirect?event=comments&redir_token=QUFFLUhqbXVjNkZoQVVybExZUDg4VkhKZ3hUOTNYYW5kQXxBQ3Jtc0tuVFlyX1FPZGVzaTFoTmwwLTJxYzc3ZnBmQ2Z6Nk5wS0JUWHd2NzJjbExUOUNOa1k0TDA5RmhlY2VfOFlKalNzWkdETWtKNS1MQkJJYmJ3cG5sNXRBclA3eXdPX3RKM0NaN0J3cEdWZGZ5bEtCOG5PTQ&q=https%3A%2F%2Fprickle-textbook-12d.notion.site%2FHoons-Board-REST-API-89f600999f6548ff998d8ec8211062a7%3Fpvs%3D4)  
[TypeScript](https://youtu.be/vs9lFblZ7oE?si=0tqi5_Nz9jKBWM6G)  
