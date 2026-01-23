package io.github.daegwonkim.backend.repository.projection

data class ChatParticipantsGroupProjection(
    val userId: Long,
    val chatRoomId: Long,
    val nickname: String
)
