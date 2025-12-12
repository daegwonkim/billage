# 1. 빌드 스테이지
FROM gradle:8.5-jdk17 AS builder

WORKDIR /app

COPY gradlew ./
COPY gradle ./gradle
COPY settings.gradle.kts ./
COPY build.gradle.kts ./

COPY domain/build.gradle.kts domain/
COPY api/build.gradle.kts api/

RUN ./gradlew dependencies --no-daemon || true

COPY . .

RUN ./gradlew :api:clean :api:bootJar --no-daemon -x test -x generateJooq

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/api/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]