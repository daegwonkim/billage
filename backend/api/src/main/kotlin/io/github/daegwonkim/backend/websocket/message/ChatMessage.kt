package io.github.daegwonkim.backend.websocket.message

import java.time.Instant

enum class MessageType {
    CHAT,
    JOIN,
    LEAVE
}

data class ChatMessageRequest(
    val content: String
)

data class ChatMessageReadRequest(
    val chatMessageId: Long
)

data class ChatMessageResponse(
    val id: Long,
    val chatRoomId: Long,
    val senderId: Long,
    val content: String,
    val type: MessageType,
    val timestamp: Instant
)

data class ChatRoomUpdateResponse(
    val chatRoomId: Long,
    val latestMessage: String,
    val latestMessageTime: Instant,
    val unreadCount: Int
)