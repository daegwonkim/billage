package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.rental_item.SearchRentalItemsResponse
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortBy
import io.github.daegwonkim.backend.enumerate.SortDirection
import io.github.daegwonkim.backend.service.RentalItemService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/rental-items")
class RentalItemController(
    private val rentalItemService: RentalItemService
) {
    @GetMapping("/search")
    fun searchRentalItems(
        @RequestParam(required = false) category: RentalItemCategory?,
        @RequestParam(required = false) keyword: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(defaultValue = "CREATED_AT") sortBy: RentalItemSortBy,
        @RequestParam(defaultValue = "DESC") sortDirection: SortDirection
    ): SearchRentalItemsResponse {
        return rentalItemService.searchRentalItems(
            category = category,
            keyword = keyword,
            page = page,
            size = size,
            sortBy = sortBy,
            sortDirection = sortDirection
        )
    }
}