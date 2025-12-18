package io.github.daegwonkim.backend.repository.dto

import java.time.LocalDateTime
import java.util.UUID

data class GetRentalItemsItem(
    val id: UUID,
    val title: String,
    val thumbnailUrl: String,
    val address: String,
    val pricePerDay: Int,
    val pricePerWeek: Int,
    val rentalCount: Int,
    val likeCount: Int,
    val createdAt: LocalDateTime
)
