package io.github.daegwonkim.backend.repository.projection

import java.time.LocalDateTime

data class UserProfileProjection(
    val id: Long,
    val publicId: String,
    val nickname: String,
    val profileImageKey: String?,
    val lastActiveAt: LocalDateTime,
    val neighborhoodVerifiedAt: LocalDateTime,
    val rentOutCount: Int,
    val rentInCount: Int,
    val createdAt: LocalDateTime,
    val sido: String,
    val sigungu: String,
    val eupmyeondong: String
)
