package io.github.daegwonkim.backend.jwt.vo

data class GeneratedTokens(
    val accessToken: String,
    val refreshToken: String
)