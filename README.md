<<<<<<< HEAD
### 유의사항
- Docker 빌드 후 로컬 IDE run 시키기
  ```
  docker-compose -f docker-compose.dev.yml --env-file .env.dev up -d --build
  ```
- Docker 빌드 시 backend 제외됐는지 확인할 것
  - backend도 같이 들어가 있을 경우 container, image, volume 전부 삭제 후 재빌드
    ```
    docker-compose -f docker-compose.dev.yml --env-file .env.dev down -v --rmi all
    docker-compose -f docker-compose.dev.yml --env-file .env.dev up -d --build
    ```
    
- BE(로컬) 도커 관련 명령어
  - 백엔드는 로컬에서 실행할 시 도커 실행 명령어
    ```
    docker-compose -f docker-compose.local.yml --env-file .env.local up -d --build
    ```
  - 로컬에서 백엔드 실행하고 있을 시 도커 다운 명령어
    ```
    docker-compose -f docker-compose.local.yml --env-file .env.local down
    ```

### 백엔드 구조
```
Back
└─src
    ├─main
    │  ├─generated
    │  ├─java
    │  │  └─com
    │  │      └─example
    │  │          └─demo
    │  │              ├─apiController
    │  │              ├─config
    │  │              │  └─auth
    │  │              │      ├─exceptionHandler
    │  │              │      ├─jwt
    │  │              │      ├─loginHandler
    │  │              │      ├─logoutHandler
    │  │              │      ├─provider
    │  │              │      ├─redis
    │  │              │      └─scheduled
    │  │              ├─controller
    │  │              ├─domain
    │  │              │  ├─dto
    │  │              │  ├─entity
    │  │              │  └─repository
    │  │              └─service
    │  └─resources
    │      ├─static
    │      │  ├─css
    │      │  ├─font
    │      │  ├─image
    │      │  └─js
    │      └─templates
    │          ├─board
    │          └─user
    └─test

Front
└─src
    ├─api
    ├─assets
    ├─components
    │  ├─board
    │  ├─notice
    │  └─user
    ├─context
    ├─css
    ├─data
    ├─hooks
    ├─services
    └─utils

Ml
├─app
│  └─__pycache__
├─data
└─models
```

### Modal 쓰는 법

ShowAlert(단순히 확인버튼만 있는 거)
ConfirmAlert(확인 취소 버튼이 있어서 사용자에게 선택하게 하는 거)

1. 불러오기
- `import { useModal } from "../../context/ModalContext";`

2. 모달들 상태 설정하기
- 'const { showAlert, showConfirm } = useModal();'

3. ShowModal 쓰기
- ```
  // 실제 삭제 API 호출 로직(ConfrimModal 안에서의 확인 버튼을 누를)
    const executeDelete = async (messageId: string) => {
        try {
            await api.delete(`/chatrooms/messages/${messageId}?email=${currentUser?.email}`);
        } catch (error) {
            console.error("삭제 실패: ", error);
            showAlert("삭제 실패", "메시지 삭제 중 오류가 발생했습니다.");
        }
    };
  ```

4. ConfirmAlert 쓰기
- ```
  const onDeleteClick = (messageId: string) => {
        showConfirm("메시지 삭제", "정말 이 메시지를 삭제하시겠습니까?", () => {
            executeDelete(messageId);
        })
    }
  ```
**잘 모르겠으면 ChatWindow에 2개 다 써져 있으니까 그거 봐주세요**
