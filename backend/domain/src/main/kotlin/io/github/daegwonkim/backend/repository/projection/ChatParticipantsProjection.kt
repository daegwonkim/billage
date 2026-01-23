package io.github.daegwonkim.backend.repository.projection

data class ChatParticipantsProjection(
    val userId: Long,
    val nickname: String,
    val profileImageKey: String?
)
