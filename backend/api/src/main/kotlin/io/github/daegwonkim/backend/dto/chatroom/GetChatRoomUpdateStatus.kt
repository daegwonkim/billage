package io.github.daegwonkim.backend.dto.chatroom

import java.time.Instant

data class GetChatRoomUpdateStatusResponse(
    val latestMessage: String,
    val latestMessageTime: Instant,
    val unreadCount: Int
)
