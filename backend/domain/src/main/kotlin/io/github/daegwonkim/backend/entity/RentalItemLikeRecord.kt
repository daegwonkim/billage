package io.github.daegwonkim.backend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime

@Entity
@Table(name = "rental_item_like_records")
class RentalItemLikeRecord(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(name = "rental_item_id", nullable = false)
    var rentalItemId: Long,

    @Column(name = "user_id", nullable = false)
    var userId: Long,

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime
)