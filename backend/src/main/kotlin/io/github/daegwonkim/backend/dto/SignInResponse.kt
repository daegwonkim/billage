package io.github.daegwonkim.backend.dto

data class SignInResponse(
    val accessToken: String,
    val refreshToken: String
)
