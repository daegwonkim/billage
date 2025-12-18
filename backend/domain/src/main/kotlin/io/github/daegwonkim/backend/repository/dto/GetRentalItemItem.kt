package io.github.daegwonkim.backend.repository.dto

import java.time.LocalDateTime
import java.util.UUID

data class GetRentalItemItem(
    val id: UUID,
    val sellerId: UUID,
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
