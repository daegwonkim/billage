package io.github.daegwonkim.backend.dto.rental_item

data class GetRentalItemSummaryResponse(
    val id: Long,
    val title: String,
    val thumbnailImageUrl: String
)