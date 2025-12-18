package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.repository.dto.GetRentalItemsItem

data class GetRentalItemsResponse(
    val content: List<GetRentalItemsItem>,
    val currentPage: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean
)
