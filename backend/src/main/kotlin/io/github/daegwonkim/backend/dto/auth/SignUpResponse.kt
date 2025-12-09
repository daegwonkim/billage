package io.github.daegwonkim.backend.dto.auth

data class SignUpResponse(
    val accessToken: String,
    val refreshToken: String
)
