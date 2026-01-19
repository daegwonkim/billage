package io.github.daegwonkim.backend.repository.projection

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import java.time.Instant

data class RentalItemProjection(
    val id: Long,
    val sellerId: Long,
    val sellerNickname: String,
    val sellerProfileImageKey: String?,
    val address: String,
    val category: RentalItemCategory,
    val title: String,
    val description: String,
    val pricePerDay: Int,
    val pricePerWeek: Int,
    val rentalCount: Int,
    val likeCount: Int,
    val viewCount: Int,
    val liked: Boolean,
    val createdAt: Instant
)
