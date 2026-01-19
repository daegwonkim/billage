package io.github.daegwonkim.backend.dto.auth

data class SignInResult(
    val userId: Long,
    val accessToken: String,
    val refreshToken: String
)
