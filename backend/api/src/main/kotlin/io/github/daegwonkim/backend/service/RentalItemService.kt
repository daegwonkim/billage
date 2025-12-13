package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.rental_item.GetCategoriesResponse
import io.github.daegwonkim.backend.dto.rental_item.RentalItemRegisterRequest
import io.github.daegwonkim.backend.dto.rental_item.RentalItemRegisterResponse
import io.github.daegwonkim.backend.dto.rental_item.SearchRentalItemsResponse
import io.github.daegwonkim.backend.entity.RentalItem
import io.github.daegwonkim.backend.entity.RentalItemImage
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortBy
import io.github.daegwonkim.backend.enumerate.SortDirection
import io.github.daegwonkim.backend.repository.RentalItemImageRepository
import io.github.daegwonkim.backend.repository.RentalItemJooqRepository
import io.github.daegwonkim.backend.repository.RentalItemRepository
import io.github.daegwonkim.backend.supabase.SupabaseStorageService
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@Service
class RentalItemService(
    private val rentalItemRepository: RentalItemRepository,
    private val rentalItemImageRepository: RentalItemImageRepository,
    private val rentalItemJooqRepository: RentalItemJooqRepository,

    private val supabaseStorageService: SupabaseStorageService,

    @Value($$"${supabase.storage.bucket.rental-item}")
    private val rentalItemBucket: String
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

    fun search(
        category: RentalItemCategory?,
        keyword: String?,
        page: Int,
        size: Int,
        sortBy: RentalItemSortBy,
        sortDirection: SortDirection
    ): SearchRentalItemsResponse {
        val sort = when (sortDirection) {
            SortDirection.ASC -> Sort.by(Sort.Direction.ASC, sortBy.name)
            SortDirection.DESC -> Sort.by(Sort.Direction.DESC, sortBy.name)
        }

        val pageable = PageRequest.of(page, size, sort)

        val result = rentalItemJooqRepository.searchRentalItems(
            category = category,
            keyword = keyword,
            pageable = pageable
        )

        return SearchRentalItemsResponse(
            content = result.content,
            currentPage = result.number,
            size = result.size,
            totalElements = result.totalElements,
            totalPages = result.totalPages,
            hasNext = result.hasNext(),
            hasPrevious = result.hasPrevious()
        )
    }

    @Transactional
    fun register(
        userId: UUID,
        request: RentalItemRegisterRequest,
        images: List<MultipartFile>
    ): RentalItemRegisterResponse {
        val newRentalItem = rentalItemRepository.save(
            RentalItem(
                userId = userId,
                title = request.title,
                description = request.description,
                category = request.category,
                pricePerDay = request.pricePerDay,
                pricePerWeek = request.pricePerWeek
            )
        )

        images.mapIndexed { index, file ->
            val fileName = supabaseStorageService.uploadFile(file = file, bucket = rentalItemBucket)
            rentalItemImageRepository.save(
                RentalItemImage(
                    rentalItemId = newRentalItem.id!!,
                    name = fileName,
                    sequence = index
                )
            )
        }

        return RentalItemRegisterResponse(id = newRentalItem.id!!)
    }
}