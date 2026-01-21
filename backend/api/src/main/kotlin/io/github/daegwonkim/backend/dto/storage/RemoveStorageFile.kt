package io.github.daegwonkim.backend.dto.storage

data class RemoveStorageFileRequest(
    val bucket: String,
    val fileKey: String
)
