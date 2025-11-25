package io.github.daegwonkim.backend.entity;

import io.github.daegwonkim.backend.enumerate.entity.RentalStatus;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@Table(name = "rental_records")
public class RentalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    private UUID userId;

    @Column(name = "rental_item_id", columnDefinition = "UUID", nullable = false)
    private UUID rentalItemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "rental_status", nullable = false)
    private RentalStatus rentalStatus;

    @Column(name = "rented_at", nullable = false)
    private LocalDateTime rentedAt;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;
}
