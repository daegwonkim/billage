package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.user.GetProfileResponse
import io.github.daegwonkim.backend.dto.user.GetUserLikedRentalItemsResponse
import io.github.daegwonkim.backend.dto.user.GetUserRentalItemsResponse
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.exception.errorcode.CommonErrorCode
import io.github.daegwonkim.backend.repository.jooq.RentalItemJooqRepository
import io.github.daegwonkim.backend.repository.jooq.UserJooqRepository
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userJooqRepository: UserJooqRepository,
    private val rentalItemJooqRepository: RentalItemJooqRepository,
    private val supabaseStorageClient: SupabaseStorageClient,

    @Value($$"${supabase.storage.bucket.user-profile-images}")
    private val userProfileImagesBucket: String,
    @Value($$"${supabase.storage.bucket.rental-item-images}")
    private val rentalItemImagesBucket: String
) {
    @Transactional(readOnly = true)
    fun getProfile(id: Long): GetProfileResponse {
        val userProfile = userJooqRepository.findUserProfileById(id)
            ?: throw ResourceNotFoundException(id, CommonErrorCode.USER_NOT_FOUND)

        return GetProfileResponse.from(
            userProfile,
            userProfile.profileImageKey?.let {
                supabaseStorageClient.getPublicUrl(userProfileImagesBucket, it)
            }
        )
    }

    @Transactional(readOnly = true)
    fun getUserRentalItems(id: Long, excludeRentalItemId: Long?): GetUserRentalItemsResponse {
        val rentalItems = rentalItemJooqRepository.findRentalItemsByUserId(id, excludeRentalItemId)
            .map { rentalItem ->
                GetUserRentalItemsResponse.RentalItem.from(
                    rentalItem,
                    supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, rentalItem.thumbnailImageKey)
                )
            }

        return GetUserRentalItemsResponse(rentalItems)
    }

    @Transactional(readOnly = true)
    fun getUserLikedRentalItems(id: Long): GetUserLikedRentalItemsResponse {
        val rentalItems = rentalItemJooqRepository.findLikedRentalItemsByUserId(id)
            .map { rentalItem ->
                GetUserLikedRentalItemsResponse.RentalItem(
                    id = rentalItem.id,
                    sellerId = rentalItem.sellerId,
                    title =  rentalItem.title,
                    thumbnailImageUrl =
                        supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, rentalItem.thumbnailImageKey),
                    pricePerDay = rentalItem.pricePerDay,
                    pricePerWeek = rentalItem.pricePerWeek,
                    address = rentalItem.address,
                    liked = rentalItem.liked,
                    stats = GetUserLikedRentalItemsResponse.RentalItem.RentalItemStats(
                        rentalCount = rentalItem.rentalCount,
                        likeCount = rentalItem.likeCount,
                        viewCount = rentalItem.viewCount
                    ),
                    createdAt = rentalItem.createdAt
                )
            }

        return GetUserLikedRentalItemsResponse(rentalItems)
    }
}