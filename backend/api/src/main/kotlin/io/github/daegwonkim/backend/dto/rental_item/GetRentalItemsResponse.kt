package io.github.daegwonkim.backend.dto.rental_item

import java.time.LocalDateTime
import java.util.UUID

data class GetRentalItemsResponse(
    val contents: List<RentalItemDto>,
    val currentPage: Int,
    val size: Int,
    val totalElements: Int,
    val totalPages: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean
) {
    data class RentalItemDto(
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
}
