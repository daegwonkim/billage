package io.github.daegwonkim.backend.jwt.vo

data class AccessTokenClaims(
    val userId: Long,
    val userNickname: String
)
