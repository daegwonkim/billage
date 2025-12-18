package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import java.util.UUID

data class RentalItemGetForModifyResponse(
    val id: UUID,
    val title: String,
    val description: String,
    val category: RentalItemCategory,
    val pricePerDay: Int?,
    val pricePerWeek: Int?,
    val images: List<RentalItemImage>
) {
    data class RentalItemImage(
        val url: String,
        val sequence: Int
    )
}
