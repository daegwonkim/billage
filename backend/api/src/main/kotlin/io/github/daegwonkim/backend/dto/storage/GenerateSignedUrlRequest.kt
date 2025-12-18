package io.github.daegwonkim.backend.dto.storage

data class GenerateSignedUrlRequest(
    val bucket: String,
    val fileName: String
)
