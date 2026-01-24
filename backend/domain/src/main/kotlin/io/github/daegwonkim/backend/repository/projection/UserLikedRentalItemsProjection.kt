package io.github.daegwonkim.backend.repository.projection

import java.time.Instant

data class UserLikedRentalItemsProjection(
    val id: Long,
    val sellerId: Long,
    val title: String,
    val thumbnailImageKey: String,
    val address: String,
    val pricePerDay: Int,
    val pricePerWeek: Int,
    val rentalCount: Int,
    val likeCount: Int,
    val viewCount: Int,
    val liked: Boolean,
    val createdAt: Instant
)
