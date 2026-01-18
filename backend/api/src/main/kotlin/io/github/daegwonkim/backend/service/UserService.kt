package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.user.GetProfileResponse
import io.github.daegwonkim.backend.dto.user.GetUserRentalItemsResponse
import io.github.daegwonkim.backend.exception.errorcode.UserErrorCode
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.repository.RentalItemJooqRepository
import io.github.daegwonkim.backend.repository.UserJooqRepository
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
            ?: throw ResourceNotFoundException(id, UserErrorCode.USER_NOT_FOUND)

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
                    rentalItem.thumbnailImageKey?.let {
                        supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, it)
                    }
                )
            }

        return GetUserRentalItemsResponse(rentalItems)
    }
}