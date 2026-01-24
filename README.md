# Billage

## 프로젝트 소개

Billage는 사용자 간 물건 대여를 중개하는 위치 기반 P2P 대여 마켓플레이스입니다. 내 동네 근처의 대여 물품을 탐색하고, 판매자와 실시간 채팅을 통해 거래할 수 있습니다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/147edd48-ae38-4cab-985e-ed2232975968" width="250" />
  <img src="https://github.com/user-attachments/assets/352c8865-0a1f-4080-8d18-a6350b8b7581" width="250" />
  <img src="https://github.com/user-attachments/assets/1cf72c4f-5551-446f-b1b4-a539564b5d3f" width="250" />
</p>

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

## 아키텍처

<img width="951" height="926" alt="billage drawio" src="https://github.com/user-attachments/assets/eea75a91-b9e7-4403-bf8e-bfce969e3b2c" />

## 모듈 구조

```
backend/
├── api/        # REST 컨트롤러, 서비스, 보안, WebSocket (실행 모듈)
├── domain/     # JPA 엔티티, 리포지토리, JOOQ 쿼리, Flyway 마이그레이션
├── infra/      # 외부 서비스 연동 (Supabase, CoolSMS, Kakao, Redis)
└── common/     # 공통 예외, 에러 코드, 유틸리티
```

## ERD

<img width="1950" height="1417" alt="billage" src="https://github.com/user-attachments/assets/ebcf8eff-38e2-4175-8935-1436d46ac191" />
