package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.rental_item.GetCategoriesResponse
import io.github.daegwonkim.backend.entity.RentalItem
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortBy
import io.github.daegwonkim.backend.enumerate.SortDirection
import io.github.daegwonkim.backend.repository.RentalItemRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class RentalItemService(
    private val rentalItemRepository: RentalItemRepository
) {

    fun getCategories(): GetCategoriesResponse {
        val categories = RentalItemCategory.entries
            .sortedBy { it.order }
            .map { category ->
                GetCategoriesResponse.Category(
                    title = category.title,
                    iconPath = category.iconPath
                )
            }

        return GetCategoriesResponse(categories = categories)
    }

    fun getRentalItems(
        category: RentalItemCategory?,
        keyword: String?,
        page: Int,
        size: Int,
        sortBy: RentalItemSortBy,
        sortDirection: SortDirection
    ): Page<RentalItem> {
        val sort = when (sortDirection) {
            SortDirection.ASC -> Sort.by(Sort.Direction.ASC, sortBy.name)
            SortDirection.DESC -> Sort.by(Sort.Direction.DESC, sortBy.name)
        }

        val pageable = PageRequest.of(page, size, sort)

        return rentalItemRepository.searchRentalItems(
            category = category,
            keyword = keyword,
            pageable = pageable
        )
    }
}