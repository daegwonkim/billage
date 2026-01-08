package io.github.daegwonkim.backend.repository.projection

import java.time.LocalDateTime

data class GetRentalItemsItem(
    val id: Long,
    val title: String,
    val thumbnailImageKey: String,
    val address: String,
    val pricePerDay: Int,
    val pricePerWeek: Int,
    val rentalCount: Int,
    val likeCount: Int,
    val viewCount: Int,
    val createdAt: LocalDateTime
)
