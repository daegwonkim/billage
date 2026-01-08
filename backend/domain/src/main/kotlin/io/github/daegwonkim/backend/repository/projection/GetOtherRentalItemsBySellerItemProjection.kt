package io.github.daegwonkim.backend.repository.projection


data class GetOtherRentalItemsBySellerItemProjection(
    val id: Long,
    val title: String,
    val thumbnailImageKey: String,
    val pricePerDay: Int,
    val pricePerWeek: Int
)
