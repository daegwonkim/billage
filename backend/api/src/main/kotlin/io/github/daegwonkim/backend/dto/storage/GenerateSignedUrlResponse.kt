package io.github.daegwonkim.backend.dto.storage

data class GenerateSignedUrlResponse(
    val fileKey: String,
    val signedUrl: String
)
