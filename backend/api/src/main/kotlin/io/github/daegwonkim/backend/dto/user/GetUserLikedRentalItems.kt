package io.github.daegwonkim.backend.dto.user

import java.time.Instant

data class GetUserLikedRentalItemsResponse(
    val rentalItems: List<RentalItem>
) {
    data class RentalItem(
        val id: Long,
        val sellerId: Long,
        val title: String,
        val thumbnailImageUrl: String,
        val pricePerDay: Int,
        val pricePerWeek: Int,
        val address: String,
        val liked: Boolean,
        val stats: RentalItemStats,
        val createdAt: Instant,
    ) {
        data class RentalItemStats(
            val rentalCount: Int,
            val likeCount: Int,
            val viewCount: Int,
        )
    }
}