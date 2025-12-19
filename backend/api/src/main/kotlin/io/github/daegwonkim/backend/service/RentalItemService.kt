package io.github.daegwonkim.backend.service

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

    @Transactional(readOnly = true)
    fun getSimilarRentalItems(id: UUID): GetSimilarRentalItemsResponse {
        return GetSimilarRentalItemsResponse(
            rentalItems = listOf(
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item1/400/300",
                    title = "캠핑 텐트 4인용",
                    pricePerDay = 15000,
                    pricePerWeek = 80000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item2/400/300",
                    title = "소니 A7M4 미러리스 카메라",
                    pricePerDay = 50000,
                    pricePerWeek = 280000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item3/400/300",
                    title = "전동 킥보드 샤오미",
                    pricePerDay = 10000,
                    pricePerWeek = 55000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item4/400/300",
                    title = "빔프로젝터 엡손 EH-TW7100",
                    pricePerDay = 25000,
                    pricePerWeek = 140000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item5/400/300",
                    title = "드론 DJI Mini 3 Pro",
                    pricePerDay = 35000,
                    pricePerWeek = 200000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item6/400/300",
                    title = "닌텐도 스위치 OLED",
                    pricePerDay = 8000,
                    pricePerWeek = 45000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item7/400/300",
                    title = "캠핑 의자 세트 (4개)",
                    pricePerDay = 5000,
                    pricePerWeek = 28000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item8/400/300",
                    title = "고프로 히어로 12",
                    pricePerDay = 20000,
                    pricePerWeek = 110000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item9/400/300",
                    title = "무선 마이크 로데 와이어리스 고",
                    pricePerDay = 12000,
                    pricePerWeek = 65000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item10/400/300",
                    title = "스탠딩 조명 세트",
                    pricePerDay = 18000,
                    pricePerWeek = 100000
                )
            )
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