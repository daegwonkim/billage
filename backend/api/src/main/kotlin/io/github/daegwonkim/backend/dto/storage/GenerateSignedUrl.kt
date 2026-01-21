package io.github.daegwonkim.backend.dto.storage

data class GenerateSignedUrlRequest(
    val bucket: String,
    val fileKey: String
)

data class GenerateSignedUrlResponse(
    val signedUrl: String
)
