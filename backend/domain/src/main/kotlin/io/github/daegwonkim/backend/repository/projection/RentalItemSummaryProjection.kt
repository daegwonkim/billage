package io.github.daegwonkim.backend.repository.projection

data class RentalItemSummaryProjection(
    val id: Long,
    val title: String,
    val thumbnailImageKey: String,
    val sellerNickname: String
)