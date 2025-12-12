package io.github.daegwonkim.backend.dto.rental_item

data class GetCategoriesResponse(
    val categories: List<Category>
) {
    data class Category(
        val title: String,
        val iconPath: String
    )
}
