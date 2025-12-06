package io.github.daegwonkim.backend.dto

data class SignUpResponse(
    val accessToken: String,
    val refreshToken: String
)
