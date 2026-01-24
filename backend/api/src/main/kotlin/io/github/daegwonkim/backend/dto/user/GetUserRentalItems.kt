package io.github.daegwonkim.backend.dto.user

import io.github.daegwonkim.backend.repository.projection.UserRentalItemsProjection

data class GetUserRentalItemsResponse(
    val rentalItems: List<RentalItem>
) {
    data class RentalItem(
        val id: Long,
        val title: String,
        val thumbnailImageUrl: String,
        val pricePerDay: Int,
        val pricePerWeek: Int
    ) {
        companion object {
            fun from(rentalItem: UserRentalItemsProjection, thumbnailImageUrl: String): RentalItem =
                RentalItem(
                    rentalItem.id,
                    rentalItem.title,
                    thumbnailImageUrl,
                    rentalItem.pricePerDay,
                    rentalItem.pricePerWeek
                )
        }
    }
}
