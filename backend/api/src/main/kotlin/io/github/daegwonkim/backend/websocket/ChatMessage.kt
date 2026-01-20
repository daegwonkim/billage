package io.github.daegwonkim.backend.websocket

import java.time.Instant
import java.util.UUID

enum class MessageType {
    CHAT,
    JOIN,
    LEAVE
}

data class ChatMessageRequest(
    val rentalItemId: Long,
    val receiverId: Long,
    val content: String
)

data class ChatMessageResponse(
    val id: UUID = UUID.randomUUID(),
    val chatRoomId: Long,
    val senderId: Long,
    val senderNickname: String,
    val content: String,
    val type: MessageType,
    val timestamp: Instant = Instant.now()
)
