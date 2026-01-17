package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.rental_item.GetOtherRentalItemsBySellerResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemCategoriesResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemForModifyResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemSortOptionsResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemsRequest
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemsResponse
import io.github.daegwonkim.backend.dto.rental_item.GetSimilarRentalItemsResponse
import io.github.daegwonkim.backend.entity.RentalItem
import io.github.daegwonkim.backend.entity.RentalItemImage
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortOption
import io.github.daegwonkim.backend.event.dto.StorageFileDeleteEvent
import io.github.daegwonkim.backend.exception.errorcode.RentalItemErrorCode
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.repository.RentalItemImageRepository
import io.github.daegwonkim.backend.repository.RentalItemJooqRepository
import io.github.daegwonkim.backend.repository.RentalItemRepository
import io.github.daegwonkim.backend.repository.projection.GetOtherRentalItemsBySellerItemProjection
import io.github.daegwonkim.backend.repository.projection.GetRentalItemsProjection
import io.github.daegwonkim.backend.redis.RentalItemViewRedisRepository
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class RentalItemService(
    private val rentalItemRepository: RentalItemRepository,
    private val rentalItemImageRepository: RentalItemImageRepository,
    private val rentalItemJooqRepository: RentalItemJooqRepository,
    private val rentalItemViewRedisRepository: RentalItemViewRedisRepository,

    private val supabaseStorageClient: SupabaseStorageClient,
    private val eventPublisher: ApplicationEventPublisher,

    @Value($$"${supabase.storage.bucket.rental-item-images}")
    private val rentalItemImagesBucket: String,
    @Value($$"${supabase.storage.bucket.user-profile-images}")
    private val userProfileImagesBucket: String
) {

    fun getRentalItemCategories(): GetRentalItemCategoriesResponse {
        val categories = RentalItemCategory.entries.map { category ->
            GetRentalItemCategoriesResponse.Category(category.name, category.label)
        }
        return GetRentalItemCategoriesResponse(categories)
    }

    fun getRentalItemSortOptions(): GetRentalItemSortOptionsResponse {
        val sortOptions = RentalItemSortOption.entries.map { sortOption ->
            GetRentalItemSortOptionsResponse.SortOption(sortOption.name, sortOption.label)
        }
        return GetRentalItemSortOptionsResponse(sortOptions)
    }

    @Transactional(readOnly = true)
    fun getRentalItems(request: GetRentalItemsRequest): GetRentalItemsResponse {
        val pageable = PageRequest.of(request.page, request.size)
        val result = rentalItemJooqRepository.getRentalItems(
            category = request.category,
            keyword = request.keyword,
            sortBy = request.sortBy,
            pageable = pageable
        )
        val content = result.content.map(::toGetRentalItemsResponse)

        return GetRentalItemsResponse.from(result, content)
    }

    @Transactional
    fun getRentalItem(userId: Long?, rentalItemId: Long): GetRentalItemResponse {
        val rentalItemProjection = rentalItemJooqRepository.getRentalItem(rentalItemId, userId)
            ?: throw ResourceNotFoundException(rentalItemId, RentalItemErrorCode.RENTAL_ITEM_NOT_FOUND)

        if (userId != null && rentalItemViewRedisRepository.markViewed(rentalItemId, userId)) {
            rentalItemJooqRepository.incrementViewCount(rentalItemId)
        }

        return GetRentalItemResponse.from(
            item = rentalItemProjection,
            imageUrls = getRentalItemImageUrls(rentalItemId),
            sellerProfileImageUrl = rentalItemProjection.sellerProfileImageKey?.let {
                supabaseStorageClient.getPublicUrl(userProfileImagesBucket, it)
            }
        )
    }

    @Transactional(readOnly = true)
    fun getSimilarRentalItems(id: Long): GetSimilarRentalItemsResponse {
        return GetSimilarRentalItemsResponse(listOf())
    }

    @Transactional(readOnly = true)
    fun getOtherRentalItemsBySeller(id: Long, sellerId: Long): GetOtherRentalItemsBySellerResponse {
        val otherRentalItems = rentalItemJooqRepository.getOtherRentalItemsBySeller(id, sellerId)
            .map(::toGetOtherRentalItemsBySellerResponse)

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
        saveRentalItemImages(newRentalItem.id, request.imageKeys)

        return RegisterRentalItemResponse(newRentalItem.id)
    }

    @Transactional(readOnly = true)
    fun getForModify(id: Long): GetRentalItemForModifyResponse {
        val rentalItem = rentalItemRepository.findById(id)
            .orElseThrow { throw ResourceNotFoundException(id, RentalItemErrorCode.RENTAL_ITEM_NOT_FOUND) }
        val rentalItemImages = getRentalItemImages(rentalItem.id)

        return GetRentalItemForModifyResponse.from(rentalItem, rentalItemImages)
    }

    @Transactional
    fun modify(
        id: Long,
        modifiedInfo: ModifyRentalItemRequest
    ): ModifyRentalItemResponse {
        val rentalItem = rentalItemRepository.findById(id)
            .orElseThrow { throw ResourceNotFoundException(id, RentalItemErrorCode.RENTAL_ITEM_NOT_FOUND) }
        rentalItem.modify(modifiedInfo.category, modifiedInfo.title, modifiedInfo.description,
            modifiedInfo.pricePerDay, modifiedInfo.pricePerWeek)

        deleteRemovedImages(modifiedInfo.deleteImageKeys)
        saveNewImages(rentalItem.id, modifiedInfo.newImageKeys)

        return ModifyRentalItemResponse(id)
    }

    private fun saveNewImages(rentalItemId: Long, newImageKeys: List<String>) {
        if (newImageKeys.isEmpty()) return

        val newRentalItemImages = newImageKeys.mapIndexed { index, key ->
            RentalItemImage(
                rentalItemId = rentalItemId,
                key = key,
                sequence = index
            )
        }
        rentalItemImageRepository.saveAll(newRentalItemImages)
    }

    private fun toGetRentalItemsResponse(rentalItem: GetRentalItemsProjection): GetRentalItemsResponse.RentalItem =
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

    private fun getRentalItemImageUrls(rentalItemId: Long): List<String> =
        rentalItemImageRepository
            .findAllByRentalItemIdOrderBySequence(rentalItemId)
            .map { image -> supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, image.key) }

    private fun toGetOtherRentalItemsBySellerResponse(rentalItem: GetOtherRentalItemsBySellerItemProjection): GetOtherRentalItemsBySellerResponse.RentalItem =
        GetOtherRentalItemsBySellerResponse.RentalItem(
            rentalItem.id,
            supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, rentalItem.thumbnailImageKey),
            rentalItem.title,
            rentalItem.pricePerDay,
            rentalItem.pricePerWeek
        )

    private fun saveRentalItemImages(rentalItemId: Long, imageKeys: List<String>) {
        val rentalItemImages = imageKeys.mapIndexed { index, key ->
            RentalItemImage(
                rentalItemId = rentalItemId,
                key = key,
                sequence = index
            )
        }
        rentalItemImageRepository.saveAll(rentalItemImages)
    }

    private fun getRentalItemImages(rentalItemId: Long): List<GetRentalItemForModifyResponse.RentalItemImage> {
        val rentalItemImages = rentalItemImageRepository.findAllByRentalItemIdOrderBySequence(rentalItemId)

        return rentalItemImages.map { image ->
            GetRentalItemForModifyResponse.RentalItemImage(image.key, image.sequence)
        }
    }

    private fun deleteRemovedImages(deleteImageKeys: List<String>) {
        if (deleteImageKeys.isEmpty()) return

        rentalItemImageRepository.deleteAllByKeyIn(deleteImageKeys)
        deleteImageKeys.forEach { key ->
            eventPublisher.publishEvent(StorageFileDeleteEvent(rentalItemImagesBucket, key))
        }
    }
}