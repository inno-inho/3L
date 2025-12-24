# 1단계: 빌드 환경
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .

# 권한 부여 및 빌드 (테스트 제외로 속도 향상)
RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test

# 2단계: 실행 환경(운영 최적화)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 빌드 단계에서 생성된 jar 파일만 복사
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar

# 컨테이너 실해 시점의 환경 변수 처리
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "app.jar"]