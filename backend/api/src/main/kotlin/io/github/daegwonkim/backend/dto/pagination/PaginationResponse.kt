package io.github.daegwonkim.backend.dto.pagination

data class PaginationResponse<T>(
    val contents: List<T>,
    val currentPage: Int,
    val size: Int,
    val totalElements: Int,
    val totalPages: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean
)
