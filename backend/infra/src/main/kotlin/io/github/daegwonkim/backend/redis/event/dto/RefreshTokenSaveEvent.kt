package io.github.daegwonkim.backend.redis.event.dto

data class RefreshTokenSaveEvent(
    val userId: Long,
    val refreshToken: String
)
