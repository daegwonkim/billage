package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.entity.RentalItem
import io.github.daegwonkim.backend.enumerate.RentalItemCategory

data class GetRentalItemForModifyResponse(
    val id: Long,
    val title: String,
    val description: String,
    val category: RentalItemCategory,
    val pricePerDay: Int?,
    val pricePerWeek: Int?,
    val images: List<String>
) {
    companion object {
        fun from(rentalItem: RentalItem, images: List<String>) =
            GetRentalItemForModifyResponse(
                rentalItem.id,
                rentalItem.title,
                rentalItem.description,
                rentalItem.category,
                rentalItem.pricePerDay,
                rentalItem.pricePerWeek,
                images
            )
    }
}
