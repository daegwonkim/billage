package io.github.daegwonkim.backend.dto.storage

data class StorageFileRemoveRequest(
    val bucket: String,
    val fileKey: String
)
