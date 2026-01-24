# Billage

## 프로젝트 소개

Billage는 사용자 간 물건 대여를 중개하는 위치 기반 P2P 대여 마켓플레이스입니다. 내 동네 근처의 대여 물품을 탐색하고, 판매자와 실시간 채팅을 통해 거래할 수 있습니다.

## 기술 스택

| 분류             | 기술                          |
|----------------|-----------------------------|
| Language       | Kotlin                      |
| Framework      | Spring Boot                 |
| Database       | PostgreSQL + PostGIS        |
| ORM / Query    | JPA + JOOQ                  |
| Migration      | Flyway                      |
| Cache          | Redis                       |
| Message Broker | RabbitMQ                    |
| Auth           | JWT + Spring Security       |
| Real-time      | WebSocket (STOMP)           |
| Storage        | Supabase Storage            |
| SMS            | CoolSMS                     |
| Scheduler      | ShedLock                    |
| Docs           | SpringDoc OpenAPI (Swagger) |

## 모듈 구조

```
backend/
├── api/        # REST 컨트롤러, 서비스, 보안, WebSocket (실행 모듈)
├── domain/     # JPA 엔티티, 리포지토리, JOOQ 쿼리, Flyway 마이그레이션
├── infra/      # 외부 서비스 연동 (Supabase, CoolSMS, Kakao, Redis)
└── common/     # 공통 예외, 에러 코드, 유틸리티
```

- **api** — `domain`, `infra`, `common` 모듈에 의존하며 실행 가능한 JAR를 생성합니다.
- **domain** — 핵심 비즈니스 엔티티와 데이터 접근 계층을 담당합니다.
- **infra** — 외부 API 및 인프라 서비스와의 통신을 캡슐화합니다.
- **common** — 모듈 간 공유되는 예외 계층과 상수를 정의합니다.

## ERD



## API 엔드포인트