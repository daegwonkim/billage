# ===============================
# 1. Build stage
# ===============================
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

COPY build.gradle settings.gradle ./
COPY api/build.gradle api/
COPY domain/build.gradle domain/
COPY infra/build.gradle infra/

RUN ./gradlew build -x test -x generateJooq --no-daemon || true

COPY . .

RUN ./gradlew :api:bootJar -x test -x generateJooq --no-daemon

# ===============================
# 2. Runtime stage
# ===============================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/api/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]