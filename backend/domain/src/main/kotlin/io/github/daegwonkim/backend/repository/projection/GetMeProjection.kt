package io.github.daegwonkim.backend.repository.projection

data class GetMeProjection(
    val nickname: String,
    val profileImageKey: String?,
    val sido: String,
    val sigungu: String,
    val eupmyeondong: String
)
