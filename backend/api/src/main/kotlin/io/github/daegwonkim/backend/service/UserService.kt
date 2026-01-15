package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.user.GetMeResponse
import io.github.daegwonkim.backend.exception.base.errorcode.UserErrorCode
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.repository.UserJooqRepository
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userJooqRepository: UserJooqRepository,
    private val supabaseStorageClient: SupabaseStorageClient,

    @Value($$"${supabase.storage.bucket.user-profile-images}")
    private val userProfileImagesBucket: String
) {
    @Transactional(readOnly = true)
    fun getMe(userId: Long): GetMeResponse {
        val me = userJooqRepository.getMe(userId)
            ?: throw ResourceNotFoundException(userId, UserErrorCode.USER_NOT_FOUND)

        return GetMeResponse(
            me.nickname,
            me.profileImageKey?.let { supabaseStorageClient.getPublicUrl(userProfileImagesBucket, it) },
            GetMeResponse.Neighborhood(me.sido, me.sigungu, me.eupmyeondong)
        )
    }
}