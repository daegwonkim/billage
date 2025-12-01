package io.github.daegwonkim.backend.entity;

import io.github.daegwonkim.backend.enumerate.entity.VerificationCodeStatus;
import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@Table(name = "verification_codes")
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String code;

    @Column(name = "attempt_count", nullable = false)
    private Integer attemptCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationCodeStatus status;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
