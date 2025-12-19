package io.github.daegwonkim.backend.dto.rental_item

import java.util.UUID

data class GetSimilarRentalItemsResponse(
    val rentalItems: List<RentalItem>
) {
    data class RentalItem(
        val id: UUID,
        val thumbnailImageUrl: String,
        val title: String,
        val pricePerDay: Int,
        val pricePerWeek: Int
    )
}
