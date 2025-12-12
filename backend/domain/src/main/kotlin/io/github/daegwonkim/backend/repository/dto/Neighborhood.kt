package io.github.daegwonkim.backend.repository.dto

import java.util.UUID

data class Neighborhood(
    val id: UUID,
    val code: String,
    val sido: String,
    val sigungu: String,
    val eupmyeondong: String
)
