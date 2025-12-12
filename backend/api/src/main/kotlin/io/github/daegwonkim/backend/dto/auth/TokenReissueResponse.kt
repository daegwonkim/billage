package io.github.daegwonkim.backend.dto.auth

data class TokenReissueResponse(
    val accessToken: String,
    val refreshToken: String
)
