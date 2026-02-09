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
