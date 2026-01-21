package io.github.daegwonkim.backend.dto.auth

data class ReissueTokenResponse(
    val accessToken: String,
    val refreshToken: String
)
