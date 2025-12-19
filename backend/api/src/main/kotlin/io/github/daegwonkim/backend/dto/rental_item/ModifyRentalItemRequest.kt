package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.enumerate.RentalItemCategory

data class ModifyRentalItemRequest(
    val title: String,
    val description: String,
    val category: RentalItemCategory,
    val pricePerDay: Int,
    val pricePerWeek: Int,
    val newImageKeys: List<String>,
    val deleteImageKeys: List<String>
)
