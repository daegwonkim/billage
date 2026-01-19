package io.github.daegwonkim.backend.repository.projection

import java.time.Instant

data class UserProfileProjection(
    val id: Long,
    val publicId: String,
    val nickname: String,
    val profileImageKey: String?,
    val lastActiveAt: Instant,
    val neighborhoodVerifiedAt: Instant,
    val rentOutCount: Int,
    val rentInCount: Int,
    val createdAt: Instant,
    val sido: String,
    val sigungu: String,
    val eupmyeondong: String
)
