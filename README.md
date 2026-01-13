# CoconutTalk

## 1. 프로젝트 개요
실시간 채팅 기능을 중심으로 한 웹 서비스의 기획 및 설계   
회원 관리, 친구 기능, 1:1 및 단체 채팅, 공지사항 기능을 포함  
회원가입시 이메일 인증만  
비밀번호 변경 : 계정 소유 증명이 핵심이기 때문에 이메일 인증을 필수로 하고, 필요 시 본인인증을 추가  

## FN 폴더 맞추기
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

---

## 2. 핵심 기능 요약

### 2.1 회원 기능
- 회원가입 (이메일/비밀번호, 소셜 로그인)
- 이메일 인증
- 로그인 (JWT Access / Refresh Token)
- 회원정보 조회 / 수정 / 삭제
- 프로필 이미지 및 상태 메시지(?) 설정
- Online / Offline 표시(지금 접속상태인지)
- 본인인증은 회원가입시에는 넣지 않고 예를 들어 메시지 전송 제한을 걸어둬서 본인인증을 통해 기능을 확장하고 싶을 때 사용


### 2.2 친구 기능
- 친구 요청 / 수락 / 삭제
- 친구 차단
- 친구 목록 조회

### 2.3 채팅 기능
- 1:1 채팅방
- 단체 채팅방
- 채팅방 목록 (고정, 알림 끄기)
- 채팅방 입장 / 퇴장 시스템 메시지
- 채팅방 관리 (이름 변경, 초대, 강퇴, 방장 위임)

### 2.4 메시지 기능
- 메시지 타입: TEXT / IMAGE / VIDEO / FILE / SYSTEM
- 이미지·영상 썸네일 미리보기
- 파일 다운로드
- 메시지 삭제 (나에게만 / 모두에게)
- 읽음 표시 (숫자 감소 방식)
- Typing 표시
- 안 읽은 메시지 수 표시
- 메시지 검색

### 2.5 공지사항 (관리자)
- 공지사항 CRUD (목록 / 상세 조회 포함)
- 파일 첨부 및 다운로드
- 메타 정보 관리
  - 제목
  - 내용 (텍스트 / 에디터)
  - 작성자 (관리자)
  - 작성일 / 수정일
  - 조회수
- 권한 관리
  - 관리자: 생성 / 수정 / 삭제
  - 일반 사용자: 조회만 가능
- 목록 UX
  - 최신순 정렬
  - 페이지네이션

### 추가 기능
- 고정 공지 기능
  - 상단 고정
  - 고정 / 해제 토글
- 예약 공지
  - 특정 날짜 / 시간에 자동 공개
  - 이벤트 / 점검 공지 활용
- 검색 & 필터
  - 제목 / 내용 검색
  - 기간별 필터
  - 중요 공지만 보기
- 중요 공지 알림
  - 중요 공지 등록 시 자동 푸시 알림

---

## 3. 도메인 설계

### 3.1 User
회원 기본 정보 및 인증 주체

### 3.2 Friend
회원 간 관계 (요청, 수락, 차단)

### 3.3 Chat
- ChatRoom: 채팅방 정보
- ChatRoomMember: 채팅방 참여자
- Message: 메시지
- MessageRead: 읽음 처리
- Attachment: 파일

### 3.4 Notice
공지사항 및 댓글

---

## 4. ERD (테이블 정의)

### USER
- email (PK)
- password
- nickname
- profile_image_url
- status_message (접속상태인지 확인?)
- role (USER / ADMIN)
- email_verified (BOOLEAN : 본인인증여부)
- email_verified_at (DATETIME)
---

### FRIEND
- id (PK)
- user_id (FK)
- friend_id (FK)
- status (REQUESTED / ACCEPTED / BLOCKED)
- created_at

---

### CHAT_ROOM
- id (PK)
- room_type (PRIVATE / GROUP)
- room_name
- owner_id (FK)
- is_deleted
- created_at
---

### CHAT_ROOM_MEMBER
- id (PK)
- chat_room_id (FK)
- user_id (FK)
- role (OWNER / MEMBER)
- is_muted
- pinned
- joined_at
- left_at

---

### MESSAGE
- id (PK)
- chat_room_id (FK)
- sender_id (FK)
- message_type
- content
- is_deleted_for_all
- created_at

---

### MESSAGE_READ
- id (PK)
- message_id (FK)
- user_id (FK)
- read_at

---

### ATTACHMENT
- id (PK)
- message_id (FK)
- file_type
- file_url
- thumbnail_url
- file_size

---

### NOTICE
- id (PK)
- title
- content
- author_id
- view_count
- is_pinned          -- 상단 고정 여부
- is_important       -- 중요 공지 여부
- open_at            -- 예약 공개 시간
- created_at
- updated_at

---

### NOTICE_COMMENT
- id (PK)
- notice_id (FK)
- user_id (FK)
- parent_id (nullable)
- content
- created_at

---

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
GET    api/user                         // 회원정보 조회
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
/ws/chat
SUBSCRIBE /topic/chat/{roomId}
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

PUT    api/notices/{id}/pin             // 상단 고정/해제
PUT    api/notices/{id}/important       // 중요 공지 설정

POST   api/notices/{id}/schedule        // 예약 공지 설정

GET    api/notices/search               // 제목/내용 검색
GET    api/notices/filter               // 기간/중요 공지 필터

POST   api/notices/{id}/files           // 파일 첨부
GET    api/notices/{id}/files/{fileId}  // 파일 다운로드

POST   api/notices/{id}/comments
```

---

## 6. 비기능 요구사항
- WebSocket 인증: JWT 기반
- 파일 업로드: S3 + Presigned URL
- 메시지 페이징: Cursor 기반
- 채팅방 마지막 메시지 캐싱

---

## 7. 향후 확장 기능
- 메시지 답장
- 이모지 리액션
- 초대 링크
- 신고 기능
- 관리자 채팅방

---

## 8. 개발 우선순위
1. 회원 / 인증
2. 채팅방 + 메시지
3. WebSocket 실시간 처리
4. 친구 기능
5. 공지사항




















### 모달 쓰는 법
쓰는 페이지나 컴포넌트에서 상태설정
```
const ChatWindow = ({ roomInfo, currentUser }: ChatWindowProps) => {

    const [ modalShow, setModalShow ] = useState(false);
    const [ modalMessage, setModalMessage ] = useState("");
```

return (<></>) 제일 하단에 붙여넣기
```
{/* 모달 컴포넌트 */}
            <AlertModal 
                show={modalShow}
                onHide={() => setModalShow(false)}
                title="알림"
                message={modalMessage}
            />
```

필요한 로직에다가 붙여넣기
```
} catch(error) {
            console.error("전송 에러: ", error);
            setModalMessage("메시지 전송에 실패했습니다.");
            setModalShow(true);
        }
```
