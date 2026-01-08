package io.github.daegwonkim.backend.dto.rental_item

data class GetRentalItemCategoriesResponse(
    val categories: List<Category>
) {
    data class Category(
        val value: String,
        val label: String
    )
}
