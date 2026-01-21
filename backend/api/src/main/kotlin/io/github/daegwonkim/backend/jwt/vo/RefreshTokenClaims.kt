package io.github.daegwonkim.backend.jwt.vo

data class RefreshTokenClaims(
    val userId: Long,
    val userNickname: String,
    val familyId: String,
    val version: Int
)
