package io.github.daegwonkim.backend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "rental_item_like_records")
class RentalItemLikeRecord(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    val id: UUID? = null,

    @Column(name = "rental_item_id", nullable = false)
    var rentalItemId: UUID,

    @Column(name = "user_id", nullable = false)
    var userId: UUID,

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime
)