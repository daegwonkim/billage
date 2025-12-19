package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemForModifyResponse
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemsResponse
import io.github.daegwonkim.backend.entity.RentalItem
import io.github.daegwonkim.backend.entity.RentalItemImage
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortBy
import io.github.daegwonkim.backend.enumerate.SortDirection
import io.github.daegwonkim.backend.event.dto.StorageFileDeleteEvent
import io.github.daegwonkim.backend.exception.NotFoundException
import io.github.daegwonkim.backend.exception.data.ErrorCode
import io.github.daegwonkim.backend.repository.RentalItemImageRepository
import io.github.daegwonkim.backend.repository.RentalItemJooqRepository
import io.github.daegwonkim.backend.repository.RentalItemRepository
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class RentalItemService(
    private val rentalItemRepository: RentalItemRepository,
    private val rentalItemImageRepository: RentalItemImageRepository,
    private val rentalItemJooqRepository: RentalItemJooqRepository,

    private val supabaseStorageClient: SupabaseStorageClient,
    private val eventPublisher: ApplicationEventPublisher,

    @Value($$"${supabase.storage.bucket.rental-item-images}")
    private val rentalItemImagesBucket: String,
    @Value($$"${supabase.storage.bucket.rental-item-images}")
    private val userProfileImagesBucket: String
) {

    @Transactional(readOnly = true)
    fun getRentalItems(
        category: RentalItemCategory?,
        keyword: String?,
        page: Int,
        size: Int,
        sortBy: RentalItemSortBy,
        sortDirection: SortDirection
    ): GetRentalItemsResponse {
        val sort = when (sortDirection) {
            SortDirection.ASC -> Sort.by(Sort.Direction.ASC, sortBy.name)
            SortDirection.DESC -> Sort.by(Sort.Direction.DESC, sortBy.name)
        }

        val pageable = PageRequest.of(page, size, sort)

        val result = rentalItemJooqRepository.getRentalItems(
            category = category,
            keyword = keyword,
            pageable = pageable
        )

        return GetRentalItemsResponse(
            content = result.content,
            currentPage = result.number,
            size = result.size,
            totalElements = result.totalElements,
            totalPages = result.totalPages,
            hasNext = result.hasNext(),
            hasPrevious = result.hasPrevious()
        )
    }

    @Transactional(readOnly = true)
    fun getRentalItem(userId: UUID, rentalItemId: UUID): GetRentalItemResponse {
        val rentalItem = rentalItemJooqRepository.getRentalItem(rentalItemId = rentalItemId, userId = userId)
            ?: throw NotFoundException(ErrorCode.RENTAL_ITEM_NOT_FOUND)

        val imageUrls = rentalItemImageRepository
            .findAllByRentalItemIdOrderBySequence(rentalItemId = rentalItem.id)
            .map { image ->
                supabaseStorageClient.getPublicUrl(
                    bucket = rentalItemImagesBucket,
                    fileKey = image.key
                )
            }

        return GetRentalItemResponse(
            id = rentalItem.id,
            seller = GetRentalItemResponse.Seller(
                id = rentalItem.sellerId,
                nickname = rentalItem.sellerNickname,
                address = rentalItem.address,
                profileImageUrl = rentalItem.sellerProfileImageKey?.let {
                    supabaseStorageClient.getPublicUrl(
                        bucket = userProfileImagesBucket,
                        fileKey = it
                    )
                }
            ),
            category = rentalItem.category,
            title = rentalItem.title,
            description = rentalItem.description,
            imageUrls = imageUrls,
            pricePerDay = rentalItem.pricePerDay,
            pricePerWeek = rentalItem.pricePerWeek,
            rentalCount = rentalItem.rentalCount,
            likeCount = rentalItem.likeCount,
            viewCount = rentalItem.viewCount,
            liked = rentalItem.liked,
            createdAt = rentalItem.createdAt
        )
    }

    @Transactional
    fun register(
        userId: UUID,
        request: RegisterRentalItemRequest
    ): RegisterRentalItemResponse {
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

        val rentalItemImages = request.imageKeys.mapIndexed { index, key ->
            RentalItemImage(
                rentalItemId = newRentalItem.id!!,
                key = key,
                sequence = index
            )
        }
        rentalItemImageRepository.saveAll(rentalItemImages)

        return RegisterRentalItemResponse(id = newRentalItem.id!!)
    }

    @Transactional(readOnly = true)
    fun getForModify(id: UUID): GetRentalItemForModifyResponse {
        val rentalItem = rentalItemRepository.findById(id)
            .orElseThrow { NotFoundException(errorCode = ErrorCode.RENTAL_ITEM_NOT_FOUND) }

        val rentalItemImages = rentalItemImageRepository.findAllByRentalItemIdOrderBySequence(rentalItemId = rentalItem.id!!)
        val images = rentalItemImages.map { image ->
            GetRentalItemForModifyResponse.RentalItemImage(
                key = image.key,
                sequence = image.sequence
            )
        }

        return GetRentalItemForModifyResponse(
            id = rentalItem.id!!,
            title = rentalItem.title,
            description = rentalItem.description,
            category = rentalItem.category,
            pricePerDay = rentalItem.pricePerDay,
            pricePerWeek = rentalItem.pricePerWeek,
            images = images
        )
    }

    @Transactional
    fun modify(
        id: UUID,
        modifiedInfo: ModifyRentalItemRequest
    ): ModifyRentalItemResponse {
        val rentalItem = rentalItemRepository.findById(id)
            .orElseThrow { NotFoundException(ErrorCode.RENTAL_ITEM_NOT_FOUND) }

        rentalItem.title = modifiedInfo.title
        rentalItem.description = modifiedInfo.description
        rentalItem.category = modifiedInfo.category
        rentalItem.pricePerDay = modifiedInfo.pricePerDay
        rentalItem.pricePerWeek = modifiedInfo.pricePerWeek

        if (modifiedInfo.deleteImageKeys.isNotEmpty()) {
            rentalItemImageRepository.deleteAllByKeyIn(modifiedInfo.deleteImageKeys)

            modifiedInfo.deleteImageKeys.forEach { key ->
                eventPublisher.publishEvent(StorageFileDeleteEvent(
                    bucket = rentalItemImagesBucket,
                    fileKey = key)
                )
            }
        }

        if (modifiedInfo.newImageKeys.isNotEmpty()) {
            val newRentalItemImages = modifiedInfo.newImageKeys.mapIndexed { index, key ->
                RentalItemImage(
                    rentalItemId = id,
                    key = key,
                    sequence = index
                )
            }
            rentalItemImageRepository.saveAll(newRentalItemImages)
        }

        return ModifyRentalItemResponse(id)
    }
}