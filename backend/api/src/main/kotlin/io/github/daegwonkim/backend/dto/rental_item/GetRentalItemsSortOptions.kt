package io.github.daegwonkim.backend.dto.rental_item

data class GetRentalItemSortOptionsResponse(
    val sortOptions: List<SortOption>
) {
    data class SortOption(
        val value: String,
        val label: String
    )
}
