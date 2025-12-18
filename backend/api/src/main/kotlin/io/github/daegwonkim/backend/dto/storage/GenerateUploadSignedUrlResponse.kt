package io.github.daegwonkim.backend.dto.storage

data class GenerateUploadSignedUrlResponse(
    val fileKey: String,
    val signedUrl: String
)
