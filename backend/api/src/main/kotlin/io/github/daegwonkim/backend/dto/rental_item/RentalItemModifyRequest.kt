package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import java.util.UUID

data class RentalItemModifyRequest(
    val id: UUID,
    val title: String,
    val description: String,
    val category: RentalItemCategory,
    val pricePerDay: Int,
    val pricePerWeek: Int
)
