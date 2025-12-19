package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.enumerate.RentalItemCategory

data class RegisterRentalItemRequest(
    val title: String,
    val description: String,
    val category: RentalItemCategory,
    val pricePerDay: Int?,
    val pricePerWeek: Int?,
    val imageKeys: List<String>
)
