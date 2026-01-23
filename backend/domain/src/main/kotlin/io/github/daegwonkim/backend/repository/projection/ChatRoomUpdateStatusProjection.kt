package io.github.daegwonkim.backend.repository.projection

import java.time.Instant

data class ChatRoomUpdateStatusProjection(
    val latestMessage: String,
    val latestMessageTime: Instant,
    val unreadCount: Int
)
