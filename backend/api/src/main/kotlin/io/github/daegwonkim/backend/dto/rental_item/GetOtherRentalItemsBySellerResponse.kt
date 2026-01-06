package io.github.daegwonkim.backend.dto.rental_item


data class GetOtherRentalItemsBySellerResponse(
    val rentalItems: List<RentalItem>
) {
    data class RentalItem(
        val id: Long,
        val thumbnailImageUrl: String,
        val title: String,
        val pricePerDay: Int,
        val pricePerWeek: Int
    )
}
