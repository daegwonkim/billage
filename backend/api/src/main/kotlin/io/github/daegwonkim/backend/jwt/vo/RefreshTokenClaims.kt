package io.github.daegwonkim.backend.jwt.vo

data class RefreshTokenClaims(
    val userId: Long,
    val familyId: String,
    val version: Int
)
