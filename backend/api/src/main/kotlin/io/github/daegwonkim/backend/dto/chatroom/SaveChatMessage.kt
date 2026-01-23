package io.github.daegwonkim.backend.dto.chatroom

import java.time.Instant

data class SaveChatMessageRequest(
    val chatRoomId: Long,
    val userId: Long,
    val content: String
)

data class SaveChatMessageResponse(
    val id: Long,
    val createdAt: Instant
)