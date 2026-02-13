# CoconutTalk

## 1. 프로젝트 개요


## 2. 프로젝트 기능 & 개발 일정
### 핵심 기능  
- 실시간 채팅 기능을 중심으로 한 웹 서비스의 기획 및 설계   
- 회원 관리, 친구 기능, 1:1 및 단체 채팅, 공지사항 기능을 포함  
- 회원가입시 이메일 인증만  
- 비밀번호 변경 : 계정 소유 증명이 핵심이기 때문에 이메일 인증을 필수로 하고, 필요 시 본인인증을 추가  
### 개발 일정  
2025.12.22 ~ 2025.02.20(7주)  
- 2025.12.22 ~ 2025.12.27 : 개발환경 설정(Docker환경)
- 2025.12.29 ~ 2025.01.03 : 개발환경 설치 + 기술 명세 작성
- 2025.01.12 ~ 2025.01.30 : 백엔드&프론트엔드 필수기능만 CRUD(각자 기능에 맞게 작업)
- 2025.02.09 ~ 2025.02.15 : 마무리 작업(병합 + 공통부분 처리 + 디자인 수정)
- 2025.02.16 ~ 2025.02.20 : 배포

## 3. 프로젝트 구조
```
FN/
 ┣ src/
 ┃ ┣ components/   # 재사용 가능한 컴포넌트
 ┃ ┣ pages/        # 페이지 단위 컴포넌트
 ┃ ┣ hooks/        # 커스텀 훅
 ┃ ┣ assets/      # 이미지, CSS
 ┃ ┃  ┣ font/
 ┃ ┃  ┣ image/
 ┃ ┃  ┗ css/
 ┃ ┣ App.jsx
 ┃ ┗ main.jsx
 ┣ public/         # 정적 파일
 ┣ package.json
 ┣ vite.config.js
 ┗ README.md
```

## 3. 팀원 소개 


## 4. ERD

### USER
- email (PK)
- password
- nickname
- profile_image_url
- status_message (접속상태인지 확인?)
- role (USER / ADMIN)
- email_verified (BOOLEAN : 본인인증여부)
- email_verified_at (DATETIME)

### FRIEND
- id (PK)
- user_id (FK)
- friend_id (FK)
- status (REQUESTED / ACCEPTED / BLOCKED)
- created_at


### CHAT_ROOM
- id (PK)
- room_type (PRIVATE / GROUP)
- room_name
- owner_id (FK)
- is_deleted
- created_at


### CHAT_ROOM_MEMBER
- id (PK)
- chat_room_id (FK)
- user_id (FK)
- role (OWNER / MEMBER)
- is_muted
- pinned
- joined_at
- left_at


### MESSAGE
- id (PK)
- chat_room_id (FK)
- sender_id (FK)
- message_type
- content
- is_deleted_for_all
- created_at


### MESSAGE_READ
- id (PK)
- message_id (FK)
- user_id (FK)
- read_at


### ATTACHMENT
- id (PK)
- message_id (FK)
- file_type
- file_url
- thumbnail_url
- file_size


### NOTICE
- id (PK)
- title
- content
- author_id
- view_count
- created_at
- updated_at



## 5. API 엔드포인트 설계

### 5.1 인증 / 회원
```
POST   api/auth/signup                   //  회원가입(is_verified=true)인지 확인 후 가입
POST   api/auth/login                    //  로그인
POST   api/auth/logout                   //  로그아웃
POST   api/auth/reissue                  //  리프레시토큰발급
POST   api/auth/email/send               //  이메일 인증 요청
POST   api/auth/email/verify             //  이메일 인증 완료

```

### 5.2 회원 / 프로필
```
GET    api/auth/user                         // 회원정보 조회
GET    api/user/{email}
PUT    api/user/{email}
DELETE api/user/{email}
GET    api/user/search
PUT    api/user/profile/image
PUT    api/user/nickname
```

### 5.3 친구
```
POST   api/friends/{userId}
PATCH api/friends/{userId}/accept
DELETE api/friends/{userId}
POST   api/friends/{userId}/block
GET    api/friends
```

### 5.4 채팅방
```
POST   api/chatrooms
GET    api/chatrooms
GET    api/chatrooms?email={user.email}  // 채팅방 목록 불러오기
GET    api/chatrooms/{roomId}
POST   api/chatrooms/{roomId}/join
POST   api/chatrooms/{roomId}/leave
PUT    api/chatrooms/{roomId}/name
POST   api/chatrooms/{roomId}/invite
POST   api/chatrooms/{roomId}/kick
PUT    api/chatrooms/{roomId}/owner
```

### 5.5 채팅 옵션
```
PUT    api/chatrooms/{roomId}/mute
PUT    api/chatrooms/{roomId}/pin
```

### 5.6 메시지
```
GET    api/chatrooms/{roomId}/messages
POST   api/chatrooms/{roomId}/messages
DELETE api/messages/{messageId}
DELETE api/messages/{messageId}/all
GET    api/chatrooms/{roomId}/search
```

### 5.7 WebSocket
```
/ws
SUBSCRIBE /sub/chat/{roomId}
SEND      /app/chat/{roomId}
SEND      /app/read/{roomId}
SEND      /app/typing/{roomId}
```

### 5.8 공지사항
```
POST   api/notices                     // 공지 등록 (관리자)
GET    api/notices                     // 공지 목록 조회
GET    api/notices/{id}                // 공지 상세 조회
PUT    api/notices/{id}                // 공지 수정 (관리자)
DELETE api/notices/{id}                // 공지 삭제 (관리자)

GET    api/notices/search               // 제목/내용 검색

POST   api/notices/{id}/files           // 파일 첨부
GET    api/notices/{id}/files/{fileId}  // 파일 다운로드

```

```
    <p>이미지를 누르시면 해당 팀원의 깃허브 페이지로 연결됩니다</p>
    <table>
      <thead>
        <tr align="center">
          <td>LEE SUHYEON</td>
          <td>LEE INHO</td>
          <td>LIM SAEROM</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><a href="https://github.com/ddaeng2001" ><img width="200" height="200" src="https://github.com/user-attachments/assets/e29f43b8-5eda-4614-b757-2a65eb276443" /></a></td>
          <td><a href="https://github.com/inno-inho"><img width="200" height="200" src="https://github.com/user-attachments/assets/f9dfd917-89ad-41c0-a0d8-bc790789f90b" /></a></td>
          <td><a href="https://github.com/rombird" ><img width="200" height="200" src="https://github.com/user-attachments/assets/ff368d14-7c14-49cf-a164-d196c9e376dd" /></a></td>
        </tr>
        <tr align="center">
          <td>데이터분석 통합</td>
          <td>백엔드 통합</td>
          <td>프론트엔드 통합</td>
        </tr>
        <tr align="center">
          <td> 공지사항CRUD <br /> 머신러닝 구축 <br /> chart.js로 트렌드 정보 설계 </td>
          <td> 커뮤니티CRUD <br /> FastAPI로 AI 예측 리포트 설계 <br />  </td>
          <td> 유저(로그인)CRUD <br /> 상권 통계 설계 </td>
        </tr>
      </tbody>
    </table>
    
</div>
```

```
    <h2>기술 스택</h2>
    <div>
        <h3>Collaboration & Tools </h3>
          <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
          <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/>
          <img src="https://img.shields.io/badge/Sourcetree-0052CC?style=for-the-badge&logo=Sourcetree&logoColor=white"/>
    </div>
    <div>
        <h3>Backend</h3>
          <img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white">
          <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
    </div>
    <div>
        <h3>Frontend</h3>
          <img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
          <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
    </div>
     <div>
        <h3>Database</h3>
            <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
            <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white">
    </div>

```


화면 구성(UI) 및 주요 기능





