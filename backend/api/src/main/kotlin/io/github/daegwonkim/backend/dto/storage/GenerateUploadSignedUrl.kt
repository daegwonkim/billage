package io.github.daegwonkim.backend.dto.storage

data class GenerateUploadSignedUrlRequest(
    val bucket: String,
    val fileName: String
)

data class GenerateUploadSignedUrlResponse(
    val fileKey: String,
    val signedUrl: String
)
