package io.github.daegwonkim.backend.jwt.vo

data class TokenClaims(
    val userId: Long,
    val familyId: String,
    val version: Int
)
