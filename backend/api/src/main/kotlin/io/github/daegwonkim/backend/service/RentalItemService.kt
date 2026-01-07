package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.rental_item.GetOtherRentalItemsBySellerResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemForModifyResponse
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemsResponse
import io.github.daegwonkim.backend.dto.rental_item.GetSimilarRentalItemsResponse
import io.github.daegwonkim.backend.entity.RentalItem
import io.github.daegwonkim.backend.entity.RentalItemImage
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortBy
import io.github.daegwonkim.backend.enumerate.SortDirection
import io.github.daegwonkim.backend.event.dto.StorageFileDeleteEvent
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
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
import kotlin.random.Random

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

        val result = rentalItemJooqRepository.getRentalItems(category, keyword, pageable)

        val content = result.content.map { rentalItem ->
            GetRentalItemsResponse.RentalItem(
                rentalItem.id,
                rentalItem.title,
                supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, rentalItem.thumbnailImageKey),
                rentalItem.address,
                rentalItem.pricePerDay,
                rentalItem.pricePerWeek,
                rentalItem.rentalCount,
                rentalItem.likeCount,
                rentalItem.viewCount,
                rentalItem.createdAt
            )
        }

        return GetRentalItemsResponse(
            content,
            result.number,
            result.size,
            result.totalElements,
            result.totalPages,
            result.hasNext(),
            result.hasPrevious()
        )
    }

    @Transactional(readOnly = true)
    fun getRentalItem(userId: Long, rentalItemId: Long): GetRentalItemResponse {
        val rentalItem = rentalItemJooqRepository.getRentalItem(rentalItemId, userId)
            ?: throw ResourceNotFoundException("RentalItem", rentalItemId)

        val imageUrls = rentalItemImageRepository
            .findAllByRentalItemIdOrderBySequence(rentalItem.id)
            .map { image ->
                supabaseStorageClient.getPublicUrl(
                    rentalItemImagesBucket,
                    image.key
                )
            }

        return GetRentalItemResponse(
            rentalItem.id,
            GetRentalItemResponse.Seller(
                rentalItem.sellerId,
                rentalItem.sellerNickname,
                rentalItem.address,
                rentalItem.sellerProfileImageKey?.let {
                    supabaseStorageClient.getPublicUrl(userProfileImagesBucket, it)
                }
            ),
            rentalItem.category,
            rentalItem.title,
            rentalItem.description,
            imageUrls,
            rentalItem.pricePerDay,
            rentalItem.pricePerWeek,
            rentalItem.rentalCount,
            rentalItem.likeCount,
            rentalItem.viewCount,
            rentalItem.liked,
            rentalItem.createdAt
        )
    }

    @Transactional(readOnly = true)
    fun getSimilarRentalItems(id: Long): GetSimilarRentalItemsResponse {
        return GetSimilarRentalItemsResponse(listOf())
    }

    @Transactional(readOnly = true)
    fun getOtherRentalItemsBySeller(
        id: Long,
        sellerId: Long
    ): GetOtherRentalItemsBySellerResponse {
        val otherRentalItems = rentalItemJooqRepository.getOtherRentalItemsBySeller(id, sellerId)
            .map { rentalItem ->
                GetOtherRentalItemsBySellerResponse.RentalItem(
                    rentalItem.id,
                    supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, rentalItem.thumbnailImageKey),
                    rentalItem.title,
                    rentalItem.pricePerDay,
                    rentalItem.pricePerWeek
                )
            }

        return GetOtherRentalItemsBySellerResponse(otherRentalItems)
    }

    @Transactional
    fun register(
        userId: Long,
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
                rentalItemId = newRentalItem.id,
                key = key,
                sequence = index
            )
        }
        rentalItemImageRepository.saveAll(rentalItemImages)

        return RegisterRentalItemResponse(newRentalItem.id)
    }

    @Transactional(readOnly = true)
    fun getForModify(id: Long): GetRentalItemForModifyResponse {
        val rentalItem = rentalItemRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("RentalItem", id) }

        val rentalItemImages = rentalItemImageRepository.findAllByRentalItemIdOrderBySequence(rentalItem.id)
        val images = rentalItemImages.map { image -> GetRentalItemForModifyResponse.RentalItemImage(image.key, image.sequence) }

        return GetRentalItemForModifyResponse(
            rentalItem.id,
            rentalItem.title,
            rentalItem.description,
            rentalItem.category,
            rentalItem.pricePerDay,
            rentalItem.pricePerWeek,
            images
        )
    }

    @Transactional
    fun modify(
        id: Long,
        modifiedInfo: ModifyRentalItemRequest
    ): ModifyRentalItemResponse {
        val rentalItem = rentalItemRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("RentalItem", id) }

        rentalItem.title = modifiedInfo.title
        rentalItem.description = modifiedInfo.description
        rentalItem.category = modifiedInfo.category
        rentalItem.pricePerDay = modifiedInfo.pricePerDay
        rentalItem.pricePerWeek = modifiedInfo.pricePerWeek

        if (modifiedInfo.deleteImageKeys.isNotEmpty()) {
            rentalItemImageRepository.deleteAllByKeyIn(modifiedInfo.deleteImageKeys)

            modifiedInfo.deleteImageKeys.forEach { key ->
                eventPublisher.publishEvent(StorageFileDeleteEvent(rentalItemImagesBucket, key))
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