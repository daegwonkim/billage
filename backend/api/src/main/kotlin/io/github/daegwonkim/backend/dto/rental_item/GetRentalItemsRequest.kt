package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortOption

data class GetRentalItemsRequest(
    val category: RentalItemCategory?,
    val keyword: String?,
    val page: Int,
    val size: Int,
    val sortBy: RentalItemSortOption,
)
