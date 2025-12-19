package io.github.daegwonkim.backend.repository.dto

import java.util.UUID

data class GetOtherRentalItemsBySellerItem(
    val id: UUID,
    val title: String,
    val thumbnailImageKey: String,
    val pricePerDay: Int,
    val pricePerWeek: Int
)
