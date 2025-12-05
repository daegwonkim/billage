package io.github.daegwonkim.backend.dto

data class TokenReissueResponse(
    val accessToken: String,
    val refreshToken: String
)
