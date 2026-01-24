package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortOption
import io.github.daegwonkim.backend.repository.projection.RentalItemsProjection
import org.springframework.data.domain.Page
import java.time.Instant

data class GetRentalItemsRequest(
    val userId: Long?,
    val category: RentalItemCategory?,
    val keyword: String?,
    val page: Int,
    val size: Int,
    val sortBy: RentalItemSortOption,
)

data class GetRentalItemsResponse(
    val content: List<RentalItem>,
    val currentPage: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean
) {
    data class RentalItem(
        val id: Long,
        val sellerId: Long,
        val title: String,
        val thumbnailImageUrl: String,
        val pricePerDay: Int,
        val pricePerWeek: Int,
        val address: String,
        val liked: Boolean,
        val stats: RentalItemStats,
        val createdAt: Instant,
    ) {
        data class RentalItemStats(
            val rentalCount: Int,
            val likeCount: Int,
            val viewCount: Int,
        )
    }

    companion object {
        fun from(result: Page<RentalItemsProjection>, content: List<RentalItem>): GetRentalItemsResponse =
            GetRentalItemsResponse(
                content,
                result.number,
                result.size,
                result.totalElements,
                result.totalPages,
                result.hasNext(),
                result.hasPrevious()
            )
    }
}
