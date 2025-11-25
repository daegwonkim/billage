package io.github.daegwonkim.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@Table(name = "rental_item_like_records")
public class RentalItemLikeRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    private UUID userId;

    @Column(name = "rental_item_id", columnDefinition = "UUID", nullable = false)
    private UUID rentalItemId;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
