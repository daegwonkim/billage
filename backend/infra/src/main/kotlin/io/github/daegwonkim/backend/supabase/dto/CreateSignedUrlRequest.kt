package io.github.daegwonkim.backend.supabase.dto

data class CreateSignedUrlRequest(
    val expiresIn: Int = 3600 // 기본 1시간 (초 단위)
)
