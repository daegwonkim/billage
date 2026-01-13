package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.user.MeResponse
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
    fun me(userId: Long): MeResponse {
        val me = userJooqRepository.getMe(userId)
            ?: throw IllegalStateException("조회된 사용자 정보가 없습니다: userId=$userId")

        return MeResponse(
            me.nickname,
            me.profileImageKey?.let { supabaseStorageClient.getPublicUrl(userProfileImagesBucket, it) },
            MeResponse.Neighborhood(me.sido, me.sigungu, me.eupmyeondong)
        )
    }
}