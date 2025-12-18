package io.github.daegwonkim.backend.dto.file

data class GenerateSignedUrlRequest(
    val bucket: String,
    val fileName: String
)
