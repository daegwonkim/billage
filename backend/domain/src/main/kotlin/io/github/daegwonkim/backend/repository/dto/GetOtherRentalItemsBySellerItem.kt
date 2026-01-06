package io.github.daegwonkim.backend.repository.dto


data class GetOtherRentalItemsBySellerItem(
    val id: Long,
    val title: String,
    val thumbnailImageKey: String,
    val pricePerDay: Int,
    val pricePerWeek: Int
)
