package io.github.daegwonkim.backend.dto.chatroom

import java.time.Instant

data class GetChatMessagesResponse(
    val messages: List<Message>
) {
    data class Message(
        val id: Long,
        val senderId: Long,
        val content: String,
        val timestamp: Instant
    )
}