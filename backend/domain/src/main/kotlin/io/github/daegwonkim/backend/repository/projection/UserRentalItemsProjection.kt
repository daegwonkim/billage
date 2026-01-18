package io.github.daegwonkim.backend.repository.projection

data class UserRentalItemsProjection(
    val id: Long,
    val thumbnailImageKey: String?,
    val title: String,
    val pricePerDay: Int,
    val pricePerWeek: Int
)
