# ===============================
# 1. Build stage
# ===============================
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app

COPY build.gradle.kts settings.gradle.kts ./
COPY api/build.gradle.kts api/
COPY domain/build.gradle.kts domain/
COPY infra/build.gradle.kts infra/

RUN ./gradlew build -x test -x generateJooqClasses --no-daemon || true

COPY . .

RUN ./gradlew :api:bootJar -x test -x generateJooqClasses --no-daemon

# ===============================
# 2. Runtime stage
# ===============================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/api/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]