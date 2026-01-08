package io.github.daegwonkim.backend.enumerate

enum class RentalItemSortOption(
    val label: String
) {
    LATEST("최신순"),
    POPULAR("인기순"),
    PRICE_LOW("가격 낮은순"),
    PRICE_HIGH("가격 높은순"),
    NEAREST("가까운순")
}