package io.github.daegwonkim.backend.repository.projection

import java.time.LocalDateTime

data class GetRentalItemItem(
    val id: Long,
    val sellerId: Long,
    val sellerNickname: String,
    val sellerProfileImageKey: String?,
    val address: String,
    val category: String,
    val title: String,
    val description: String,
    val pricePerDay: Int,
    val pricePerWeek: Int,
    val rentalCount: Int,
    val likeCount: Int,
    val viewCount: Int,
    val liked: Boolean,
    val createdAt: LocalDateTime
)
