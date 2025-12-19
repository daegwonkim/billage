package io.github.daegwonkim.backend.dto.rental_item

import java.time.LocalDateTime
import java.util.UUID

data class GetRentalItemsResponse(
    val content: List<RentalItem>,
    val currentPage: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean
) {
    data class RentalItem(
        val id: UUID,
        val title: String,
        val thumbnailImageUrl: String,
        val address: String,
        val pricePerDay: Int,
        val pricePerWeek: Int,
        val rentalCount: Int,
        val likeCount: Int,
        val viewCount: Int,
        val createdAt: LocalDateTime
    )
}
