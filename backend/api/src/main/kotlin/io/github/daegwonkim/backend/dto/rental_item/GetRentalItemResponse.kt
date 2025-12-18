package io.github.daegwonkim.backend.dto.rental_item

import java.time.LocalDateTime
import java.util.UUID

data class GetRentalItemResponse(
    val id: UUID,
    val seller: Seller,
    val category: String,
    val title: String,
    val description: String,
    val imageUrls: List<String>,
    val pricePerDay: Int,
    val pricePerWeek: Int,
    val rentalCount: Int,
    val likeCount: Int,
    val viewCount: Int,
    val liked: Boolean,
    val createdAt: LocalDateTime
) {
    data class Seller(
        val id: UUID,
        val nickname: String,
        val address: String,
        val profileImageUrl: String?
    )
}
