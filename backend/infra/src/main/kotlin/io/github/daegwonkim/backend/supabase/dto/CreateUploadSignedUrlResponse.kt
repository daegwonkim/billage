package io.github.daegwonkim.backend.supabase.dto

data class CreateUploadSignedUrlResponse(
    val url: String,
    val token: String? = null
)
