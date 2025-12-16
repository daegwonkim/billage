package io.github.daegwonkim.backend.event.dto

data class StorageFileDeleteEvent(
    val bucket: String,
    val fileKey: String
)
