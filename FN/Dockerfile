# 개발 /빌드 환겨
FROM node:20-alpine
WORKDIR /app

# 의존성 설치(캐시 활용을 위해 package.json 먼저 복사)
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Vite 기본 포트
EXPOSE 5173

# 개발 서버 실행(운영 시에는 빌드 후 nginx로 서빙하도록 수정 가능)
CMD ["npm", "run", "dev", "--", "--host"]

