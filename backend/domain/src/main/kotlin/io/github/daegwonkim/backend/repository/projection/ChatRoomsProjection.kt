package io.github.daegwonkim.backend.repository.projection

import java.time.Instant

data class ChatRoomsProjection(
    val id: Long,
    val rentalItemTitle: String,
    val rentalItemThumbnailImageKey: String,
    val latestMessage: String,
    val latestMessageTime: Instant,
    val unreadCount: Int
)
