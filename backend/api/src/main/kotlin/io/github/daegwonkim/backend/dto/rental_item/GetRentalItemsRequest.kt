package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortBy
import io.github.daegwonkim.backend.enumerate.SortDirection

data class GetRentalItemsRequest(
    val category: RentalItemCategory?,
    val keyword: String?,
    val page: Int,
    val size: Int,
    val sortBy: RentalItemSortBy,
    val sortDirection: SortDirection
)
