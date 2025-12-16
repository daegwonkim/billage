package io.github.daegwonkim.backend.dto.file

data class GenerateSignedUrlResponse(
    val fileKey: String,
    val uploadUrl: String,
    val publicUrl: String
)
