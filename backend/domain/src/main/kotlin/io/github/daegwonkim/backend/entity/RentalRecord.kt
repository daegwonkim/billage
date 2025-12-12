package io.github.daegwonkim.backend.entity

import io.github.daegwonkim.backend.enumerate.RentalStatus
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "rental_records")
class RentalRecord(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    val id: UUID? = null,

    @Column(name = "rental_item_id", nullable = false)
    var rentalItemId: UUID,

    @Column(name = "user_id", nullable = false)
    var userId: UUID,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: RentalStatus,

    @Column(name = "rented_at", nullable = false)
    @CreatedDate
    var rentedAt: LocalDateTime,

    @Column(name = "returned_at")
    var returnedAt: LocalDateTime
)