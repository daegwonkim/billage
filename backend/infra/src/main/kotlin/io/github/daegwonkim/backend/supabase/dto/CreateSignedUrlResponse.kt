package io.github.daegwonkim.backend.supabase.dto

data class CreateSignedUrlResponse(
    val url: String,
    val token: String? = null
)
