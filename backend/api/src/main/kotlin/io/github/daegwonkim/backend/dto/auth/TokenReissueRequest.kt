package io.github.daegwonkim.backend.dto.auth

data class TokenReissueRequest(
    val refreshToken: String
)
