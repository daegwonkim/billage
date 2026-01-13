package io.github.daegwonkim.backend.dto.user

data class MeResponse(
    val nickname: String,
    val profileImageUrl: String?,
    val neighborhood: Neighborhood
) {
    data class Neighborhood(
        val sido: String,
        val sigungu: String,
        val eupmyeondong: String
    )
}