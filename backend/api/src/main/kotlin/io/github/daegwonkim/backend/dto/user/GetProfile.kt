package io.github.daegwonkim.backend.dto.user

import io.github.daegwonkim.backend.repository.projection.UserProfileProjection
import java.time.Instant

data class GetProfileResponse(
    val id: Long,
    val publicId: String,
    val nickname: String,
    val profileImageUrl: String?,
    val lastActiveAt: Instant,
    val neighborhoodVerifiedAt: Instant,
    val rentOutCount: Int,
    val rentInCount: Int,
    val createdAt: Instant,
    val neighborhood: Neighborhood
) {
    companion object {
        fun from(userProfile: UserProfileProjection, profileImageUrl: String?) =
            GetProfileResponse(
                userProfile.id,
                userProfile.publicId,
                userProfile.nickname,
                profileImageUrl,
                userProfile.lastActiveAt,
                userProfile.neighborhoodVerifiedAt,
                userProfile.rentOutCount,
                userProfile.rentInCount,
                userProfile.createdAt,
                Neighborhood(userProfile.sido, userProfile.sigungu, userProfile.eupmyeondong)
            )
    }

    data class Neighborhood(
        val sido: String,
        val sigungu: String,
        val eupmyeondong: String
    )
}