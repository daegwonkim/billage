package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.repository.dto.SearchedRentalItem

data class SearchRentalItemsResponse(
    val content: List<SearchedRentalItem>,
    val currentPage: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean
)
